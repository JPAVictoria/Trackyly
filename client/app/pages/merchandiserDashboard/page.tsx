"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/frontend/Navbar";
import NameBlock from "@/components/frontend/NameBlock";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCommonUtils } from "@/app/hooks/useCommonUtils";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { format } from "date-fns";
import { useLoading } from "@/app/context/loaderContext";

export default function MerchandiserDashboard() {
  useRoleGuard(["MERCHANDISER"]);
  const { openSnackbar } = useCommonUtils();
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  // Initialize state to hold the user information
  const [merchandiserId, setMerchandiserId] = useState<string | null>(null);

  // Set merchandiserId from localStorage when the component is mounted (client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setMerchandiserId(user.id || null);
    }
  }, []); // Empty dependency array means this effect runs only once, when the component mounts

  // Type definition for SOSForm
  type SOSForm = {
    id: string;
    outlet: string;
    wine: number;
    beer: number;
    juice: number;
    createdAt: string;
  };

  // Format the outlet name
  const formatOutletName = (outlet: string) => {
    return outlet
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Fetch SOS forms data
  const {
    data: sosForms = [],
    isLoading,
    error,
  } = useQuery<SOSForm[]>({
    queryKey: ["sosForms"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/user/sosform", {
        withCredentials: true,
        params: { merchandiserId },
      });
      return res.data;
    },
    enabled: !!merchandiserId, // Ensure query runs only when merchandiserId is set
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.put(
        `http://localhost:5000/user/sosform/softDelete/${id}`,
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

  const rows = sosForms.map((form) => ({
    id: form.id,
    outlet: formatOutletName(form.outlet),
    createdAt: format(new Date(form.createdAt), "MMMM d, yyyy h:mm a"),
    wine: form.wine,
    beer: form.beer,
    juice: form.juice,
  }));

  const columns: GridColDef[] = [
    {
      field: "outlet",
      headerName: "Outlet",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1.2,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "wine",
      headerName: "Wine",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "beer",
      headerName: "Beer",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "juice",
      headerName: "Juice",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      width: 300,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Button size="medium" variant="text" sx={buttonStyle}>
            <Pencil className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>
              Edit
            </Typography>
          </Button>
          <Button size="medium" variant="text" sx={buttonStyle}>
            <Eye className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>
              Read
            </Typography>
          </Button>
          <Button
            size="medium"
            variant="text"
            sx={buttonStyle}
            onClick={() => handleSoftDelete(params.row.id)}
          >
            <Trash2 className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>
              Delete
            </Typography>
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

const buttonStyle = {
  minWidth: "auto",
  padding: "8px 16px",
  color: "#2F27CE",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 80,
  height: "100%",
  opacity: 0.6,
  "&:hover": {
    opacity: 1,
    backgroundColor: "rgba(47, 39, 206, 0.04)",
  },
};

const captionStyle = {
  fontSize: "0.7rem",
  marginTop: "4px",
  color: "#2F27CE",
};
