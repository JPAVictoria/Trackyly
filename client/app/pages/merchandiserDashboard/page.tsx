"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Navbar from "@/components/frontend/Navbar";
import NameBlock from "@/components/frontend/NameBlock";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCommonUtils } from "@/app/hooks/useCommonUtils";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { format } from "date-fns";
import { buttonStyle, captionStyle, centerAligned } from "@/app/styles/styles"; 

export default function MerchandiserDashboard() {
  const router = useRouter();
  useRoleGuard(["MERCHANDISER"]);
  const { openSnackbar, setLoading } = useCommonUtils();
  const queryClient = useQueryClient();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const [merchandiserId, setMerchandiserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setMerchandiserId(user.id || null);
    }
  }, []);

  type SOSForm = {
    id: string;
    outlet: string;
    wine: number;
    beer: number;
    juice: number;
    createdAt: string;
  };

  const formatOutletName = (outlet: string) => {
    return outlet
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const {
    data: sosForms = [],
    isLoading,
    error,
  } = useQuery<SOSForm[]>({
    queryKey: ["sosForms"],
    queryFn: async () => {
      const res = await axios.get("https://trackyly.onrender.com/user/sosform", {
        withCredentials: true,
        params: { merchandiserId },
      });
      return res.data;
    },
    enabled: !!merchandiserId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.put(
        `https://trackyly.onrender.com/user/sosform/softDelete/${id}`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<SOSForm[]>(
        ["sosForms"],
        (old) => old?.filter((form) => form.id !== id) || []
      );
      openSnackbar("Form successfully deleted", "success");
    },
    onError: () => {
      openSnackbar("Failed to delete form", "error");
    },
  });

  const handleSoftDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleRead = (id: string) => {
    router.push(`/pages/conforme?id=${id}&readonly=true`);
  };

  
  const handleEdit = (id: string) => {
    router.push(`/pages/createForm?id=${id}&edit=true`);
  };

  const rows = sosForms.map((form) => ({
    id: form.id,
    outlet: formatOutletName(form.outlet),
    createdAt: format(new Date(form.createdAt), "MMMM d, yyyy h:mm a"),
    wine: form.wine,
    beer: form.beer,
    juice: form.juice,
  }));

  const columns: GridColDef[] = [
    { field: "outlet", headerName: "Outlet", flex: 1, ...centerAligned },
    { field: "createdAt", headerName: "Created Date", flex: 1.2, ...centerAligned },
    { field: "wine", headerName: "Wine", flex: 1, ...centerAligned },
    { field: "beer", headerName: "Beer", flex: 1, ...centerAligned },
    { field: "juice", headerName: "Juice", flex: 1, ...centerAligned },
    {
      field: "actions",
      headerName: "Action",
      width: 300,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      ...centerAligned,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
          <Button
            size="medium"
            variant="text"
            sx={buttonStyle}
            onClick={() => handleEdit(params.row.id)}
          >
            <Pencil className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>Edit</Typography>
          </Button>
          <Button
            size="medium"
            variant="text"
            sx={buttonStyle}
            onClick={() => handleRead(params.row.id)}
          >
            <Eye className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>Read</Typography>
          </Button>
          <Button
            size="medium"
            variant="text"
            sx={buttonStyle}
            onClick={() => handleSoftDelete(params.row.id)}
          >
            <Trash2 className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>Delete</Typography>
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col items-center justify-center relative">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-10 w-full text-center">
        <div className="mb-6 w-full max-w-md">
          <NameBlock />
        </div>

        {error && (
          <Typography color="error" className="mb-4">
            Failed to load SOS forms: {(error as Error).message}
          </Typography>
        )}

        <Box
          sx={{
            height: 500,
            width: "80%",
            maxWidth: "90vw",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <DataGrid
            getRowId={(row) => row.id}
            rows={rows}
            columns={columns}
            loading={isLoading}
            pagination
            pageSizeOptions={[5, 10, 20]}
            disableColumnMenu
            disableColumnResize
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            rowHeight={80}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#fff",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none !important",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "hidden !important",
              },
              "& .MuiDataGrid-row": {
                ":hover": { backgroundColor: "transparent" },
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
}


