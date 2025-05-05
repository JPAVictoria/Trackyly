"use client";

import React, { useEffect } from "react"; 
import Navbar from "@/components/frontend/Navbar";
import NameBlock from "@/components/frontend/NameBlock";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCommonUtils } from "@/app/hooks/useCommonUtils"; 
import useRoleGuard from "@/app/hooks/useRoleGuard";

const rows = [
  {
    id: 1,
    outlet: "PARANAQUE CITY",
    createdAt: "March 20, 2025 7:50 PM",
    wine: "20",
    beer: "40",
    juice: "50",
  },
];

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
    width: 350,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "bold-header",
    renderCell: () => (
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Button
          size="medium"
          variant="text"
          sx={buttonStyle}
        >
          <Pencil className="w-4 h-4" />
          <Typography variant="caption" sx={captionStyle}>
            Edit
          </Typography>
        </Button>

        <Button
          size="medium"
          variant="text"
          sx={buttonStyle}
        >
          <Eye className="w-4 h-4" />
          <Typography variant="caption" sx={captionStyle}>
            Read
          </Typography>
        </Button>

        <Button
          size="medium"
          variant="text"
          sx={buttonStyle}
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

export default function MerchandiserDashboard() {

  useRoleGuard(["MERCHANDISER"]);

  const { setLoading } = useCommonUtils();  

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col items-center justify-center relative">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-10 w-full text-center">
        <div className="mb-6 w-full max-w-md">
          <NameBlock />
        </div>
        <Box
          sx={{
            height: 500,
            width: "80%",
            maxWidth: "90vw",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 1,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3f3f3",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #eee",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            pagination
            rowHeight={75}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
              "& .bold-header": {
                fontWeight: "bold",
                fontSize: "0.9rem",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "inherit",
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
