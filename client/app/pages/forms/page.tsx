"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/frontend/Navbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Eye } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { useLoading } from "@/app/context/loaderContext";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/app/stores/useModalStore";
import DateModal from "@/components/frontend/DateModal";
import OutletModal from "@/components/frontend/OutletModal";
import Filters from "@/components/frontend/Filters";
import { buttonStyle, captionStyle, centerAligned } from "@/app/styles/styles";
import { apiUrl } from "@/app/utils/apiUrl";

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
  
  // Replace date store with local state
  const [dateRange, setDateRange] = useState<{
    fromDate: Date | null;
    toDate: Date | null;
  }>({ fromDate: null, toDate: null });
  
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);

  const {
    selectedFilter,
    isDateModalOpen,
    isOutletModalOpen,
    setIsDateModalOpen,
    setIsOutletModalOpen,
    handleFilterClick,
  } = useModalStore();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const { data: sosForms = [], isLoading } = useQuery<SOSForm[]>({
    queryKey: ["sosForms"],
    queryFn: async () => {
      const res = await axios.get(apiUrl("/user/sosform/all"), {
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

  const handleRead = (id: string) => {
    setLoading(true);
    router.push(`/pages/conforme?id=${id}&readonly=true`);
  };

  const handleApplyDateFilter = (fromDate: Date | null, toDate: Date | null) => {
    setDateRange({ fromDate, toDate });
  };

  const handleSelectOutlet = (outlet: string | null) => {
    setSelectedOutlet(outlet);
    setIsOutletModalOpen(false);
  };

  // Filter and process rows
  const rows = sosForms
    .filter((form) => {
      // Outlet filter
      if (selectedOutlet && form.outlet !== selectedOutlet) return false;

      // Date filter
      if (dateRange.fromDate && dateRange.toDate) {
        const formDate = parseISO(form.createdAt);
        return isWithinInterval(formDate, {
          start: startOfDay(dateRange.fromDate),
          end: endOfDay(dateRange.toDate),
        });
      }

      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((form) => ({
      id: form.id,
      outlet: formatOutletName(form.outlet),
      createdAt: format(new Date(form.createdAt), "MMMM d, yyyy h:mm a"),
      wine: form.wine,
      beer: form.beer,
      juice: form.juice,
      email: form.email,
    }));

  const columns: GridColDef[] = [
    { field: "outlet", headerName: "Outlet", flex: 1, ...centerAligned },
    { field: "createdAt", headerName: "Created Date", flex: 1.2, ...centerAligned },
    { field: "wine", headerName: "Wine", flex: 1, ...centerAligned },
    { field: "beer", headerName: "Beer", flex: 1, ...centerAligned },
    { field: "juice", headerName: "Juice", flex: 1, ...centerAligned },
    { field: "email", headerName: "Merchandiser Email", flex: 1.5, ...centerAligned },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      ...centerAligned,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
          <Button size="medium" variant="text" sx={buttonStyle} onClick={() => handleRead(params.row.id)}>
            <Eye className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>
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

        <Box sx={{ width: "80%", maxWidth: "90vw", display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: "8px" }}>
          <Filters
            selectedFilter={selectedFilter}
            handleFilterClick={handleFilterClick}
            isDateFilterActive={!!(dateRange.fromDate && dateRange.toDate)}
            isOutletFilterActive={!!selectedOutlet}
          />
        </Box>

        <Box sx={{ height: 500, width: "80%", maxWidth: "90vw", backgroundColor: "white", borderRadius: "8px" }}>
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

      <DateModal
        open={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleApplyDateFilter}
        initialFromDate={dateRange.fromDate}
        initialToDate={dateRange.toDate}
      />

      <OutletModal
        open={isOutletModalOpen}
        onClose={() => setIsOutletModalOpen(false)}
        onSelectOutlet={handleSelectOutlet}
        selectedOutlet={selectedOutlet}
      />
    </div>
  );
}