"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/frontend/Navbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Eye } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { format } from "date-fns";
import { useLoading } from "@/app/context/loaderContext";
import { useRouter } from "next/navigation";

type SOSForm = {
  id: string;
  outlet: string;
  wine: number;
  beer: number;
  juice: number;
  createdAt: string;
  email: string;
};

export default function AdminForms() {
  useRoleGuard(["ADMIN"]);
  const { setLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const {
    data: sosForms = [],
    isLoading,
    error,
  } = useQuery<SOSForm[]>({
    queryKey: ["sosForms"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/user/sosform/all", {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const formatOutletName = (outlet: string) => {
    return outlet
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const rows = sosForms.map((form) => ({
    id: form.id,
    outlet: formatOutletName(form.outlet),
    createdAt: format(new Date(form.createdAt), "MMMM d, yyyy h:mm a"),
    wine: form.wine,
    beer: form.beer,
    juice: form.juice,
    email: form.email,
  }));

  const handleRead = (id: string) => {
    setLoading(true);  
    console.log("Navigating to form ID:", id); 
    router.push(`/pages/conforme?id=${id}&readonly=true`);
  };

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
      field: "email",
      headerName: "Merchandiser Email",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
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
            <Eye className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle} onClick={() => handleRead(params.row.id)}
            >
              Read
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
        <h1 className="text-[24px] font-bold text-[#2F27CE] text-center mb-10">
          User Roles and Permissions
        </h1>

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
