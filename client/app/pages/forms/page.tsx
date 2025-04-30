"use client";

import Navbar from "@/components/frontend/Navbar";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Eye } from "lucide-react";
import { Button, Stack, Typography } from "@mui/material";

const ActionButtons = () => (
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
      sx={{
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
      }}
    >
      <Eye className="w-4 h-4" />
      <Typography variant="caption" sx={{ fontSize: "0.7rem", marginTop: "4px" }}>
        Read
      </Typography>
    </Button>
  </Stack>
);

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
    width: 150,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "bold-header",
    renderCell: () => <ActionButtons />,
  },
];

export default function Forms() {
  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col items-center justify-center">
      <Navbar />
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
