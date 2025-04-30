"use client";

import Navbar from "@/components/frontend/Navbar";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Shield, Trash2 } from "lucide-react";
import { Button, Stack, Typography } from "@mui/material";

const ActionButtons = () => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="center"
    alignItems="center"
    sx={{ height: "100%" }}
  >
    <Button size="medium" variant="text" sx={buttonStyle}>
      <Shield className="w-4 h-4" />
      <Typography variant="caption" sx={captionStyle}>
        Role
      </Typography>
    </Button>

    <Button size="medium" variant="text" sx={buttonStyle}>
      <Trash2 className="w-4 h-4" />
      <Typography variant="caption" sx={captionStyle}>
        Delete
      </Typography>
    </Button>
  </Stack>
);

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
};

const captionStyle = {
  fontSize: "0.7rem",
  marginTop: "4px",
};

// Dummy rows
const rows = [
  {
    id: 1,
    email: "user1@example.com",
    role: "Admin",
    createdAt: "April 29, 2025 10:15 AM",
  },
  {
    id: 2,
    email: "user2@example.com",
    role: "Merchandiser",
    createdAt: "April 28, 2025 9:00 AM",
  },
];

// Define only 4 columns
const columns: GridColDef[] = [
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    headerClassName: "bold-header",
  },
  {
    field: "role",
    headerName: "Role",
    flex: 1,
    headerAlign: "center",
    align: "center",
    headerClassName: "bold-header",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    headerClassName: "bold-header",
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "bold-header",
    renderCell: () => <ActionButtons />,
  },
];

export default function UserRoles() {
  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col items-center justify-center">
      <Navbar />
      <h1 className="text-[24px] font-bold text-[#2F27CE] text-center mb-10">
         User Roles and Permissions
        </h1>
      <div className="flex flex-col items-center justify-center p-10 w-full text-center">
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
