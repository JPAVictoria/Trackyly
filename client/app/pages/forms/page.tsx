"use client";

import Navbar from "@/components/frontend/Navbar";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Eye, Filter } from "lucide-react";

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
  transition: "opacity 0.3s, background-color 0.3s",
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
      sx={buttonStyle}
    >
      <Eye className="w-4 h-4" />
      <Typography variant="caption" sx={captionStyle}>
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
      <h1 className="text-[24px] font-bold text-[#2F27CE] text-center mb-10">
        Overall Share of Shelf Forms
      </h1>

      <div className="flex flex-col items-center justify-center p-10 w-full text-center">
        <Box
          sx={{
            width: "80%",
            maxWidth: "90vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginBottom: "8px",
          }}
        >
          <Stack
            direction="column"
            spacing={0.5}
            alignItems="center"
            sx={{
              color: "#2d2d2d",
              cursor: "pointer",
              opacity: 0.8,
              marginRight: "5px",
              transition: "opacity 0.3s",
              "&:hover": {
                opacity: 0.6,
              },
            }}
          >
            <Filter size={20} />
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              Filter
            </Typography>
          </Stack>
        </Box>

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
              border: "1px solid #ddd",
            }}
          />
        </Box>
      </div>
    </div>
  );
}
