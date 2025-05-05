"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Box, Stack, Typography } from "@mui/material";
import { Eye } from "lucide-react";
import { useModalStore } from "@/app/stores/useModalStore";
import { useDateStore } from "@/app/stores/useDateStore";
import DateModal from "@/components/frontend/DateModal";
import OutletModal from "@/components/frontend/OutletModal";
import Navbar from "@/components/frontend/Navbar";
import Filters from "@/components/frontend/Filters";
import useRoleGuard from "@/app/hooks/useRoleGuard";

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
    <Button size="medium" variant="text" sx={buttonStyle}>
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
  {
    id: 2,
    outlet: "Makati City",
    createdAt: "April 25, 2025 5:30 PM",
    wine: "30",
    beer: "25",
    juice: "45",
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

    useRoleGuard(["ADMIN"]);
  
  const {
    selectedFilter,
    isDateModalOpen,
    isOutletModalOpen,
    setSelectedFilter,
    setIsDateModalOpen,
    setIsOutletModalOpen,
    handleFilterClick,
  } = useModalStore();

  const { fromDate, toDate, setFromDate, setToDate } = useDateStore();

  const handleApplyCustomFilter = (
    fromDate: Date | null,
    toDate: Date | null
  ) => {
    console.log("Applying custom filter with dates:", { fromDate, toDate });
    setFromDate(fromDate);
    setToDate(toDate);
    setSelectedFilter("Custom");
    setIsDateModalOpen(false);
  };

  const handleApplyOutletFilter = (outlet: string | null) => {
    if (outlet) {
      setSelectedFilter(`Outlet: ${outlet}`);
    }
    setIsOutletModalOpen(false);
  };

  const filteredRows = rows.filter((row) => {
    const createdAt = new Date(row.createdAt);
    return (
      (fromDate ? createdAt >= fromDate : true) &&
      (toDate ? createdAt <= toDate : true)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col items-center justify-center">
      <Navbar />
      <h1 className="text-[24px] font-bold text-[#2F27CE] text-center mb-5">
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
          <Filters
            selectedFilter={selectedFilter}
            handleFilterClick={handleFilterClick}
          />
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
            getRowId={(row) => row.id}
            rows={filteredRows}
            columns={columns}
            loading={false}
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
                color: "#3E2723",
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

      <DateModal
        open={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleApplyCustomFilter}
      />

      <OutletModal
        open={isOutletModalOpen}
        onClose={() => setIsOutletModalOpen(false)}
        onSelectOutlet={handleApplyOutletFilter}
      />
    </div>
  );
}
