"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/frontend/Navbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Eye } from "lucide-react";
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import moment, { Moment } from "moment";
import { useLoading } from "@/app/context/loaderContext";
import { useRouter } from "next/navigation";
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

type FilterType = "Custom" | "Outlet" | "Default";

export default function AdminForms() {
  useRoleGuard(["ADMIN"]);
  const { setLoading } = useLoading();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("Default");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    fromDate: Moment | null;
    toDate: Moment | null;
  }>({ fromDate: null, toDate: null });
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);

  const handleFilterClick = (label: FilterType) => {
    switch (label) {
      case "Custom":
        setIsDateModalOpen(true);
        break;
      case "Outlet":
        setIsOutletModalOpen(true);
        break;
      default:
        setSelectedFilter(label);

        if (label === "Default") {
          setDateRange({ fromDate: null, toDate: null });
        }
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const buildQueryParams = () => {
    const params: Record<string, string> = {};

    if (selectedOutlet) {
      params.outlet = selectedOutlet;
    }

    if (dateRange.fromDate) {
      params.fromDate = moment(dateRange.fromDate).format("YYYY-MM-DD");
    }

    if (dateRange.toDate) {
      params.toDate = moment(dateRange.toDate).format("YYYY-MM-DD");
    }

    return params;
  };

  const { data: sosForms = [], isLoading } = useQuery<SOSForm[]>({
    queryKey: [
      "sosForms",
      selectedOutlet,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: async () => {
      const params = buildQueryParams();
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `${apiUrl("/user/sosform/all")}?${queryString}`
        : apiUrl("/user/sosform/all");

      const res = await axios.get(url, {
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

  const handleApplyDateFilter = (
    fromDate: Moment | null,
    toDate: Moment | null
  ) => {
    if (fromDate && toDate) {
      setDateRange({
        fromDate: fromDate.clone().startOf("day"),
        toDate: toDate.clone().endOf("day"),
      });
    } else {
      setDateRange({ fromDate, toDate });
    }
    setSelectedFilter("Custom");
    setIsDateModalOpen(false);
  };

  const handleSelectOutlet = (outlet: string | null) => {
    setSelectedOutlet(outlet);
    setSelectedFilter("Outlet");
    setIsOutletModalOpen(false);
  };

  const rows = sosForms.map((form) => ({
    id: form.id,
    outlet: formatOutletName(form.outlet),
    createdAt: moment(form.createdAt).format("MMMM D, YYYY h:mm A"),
    wine: form.wine,
    beer: form.beer,
    juice: form.juice,
    email: form.email,
  }));

  const columns: GridColDef[] = [
    { field: "outlet", headerName: "Outlet", flex: 1, ...centerAligned },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1.2,
      ...centerAligned,
    },
    { field: "wine", headerName: "Wine", flex: 1, ...centerAligned },
    { field: "beer", headerName: "Beer", flex: 1, ...centerAligned },
    { field: "juice", headerName: "Juice", flex: 1, ...centerAligned },
    {
      field: "email",
      headerName: "Merchandiser Email",
      flex: 1.5,
      ...centerAligned,
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      ...centerAligned,
      renderCell: (params) => (
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
            onClick={() => handleRead(params.row.id)}
          >
            <Eye className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>
              Read
            </Typography>
          </Button>
        </Stack>
      ),
    },
  ];

  const MobileCard = ({ form }: { form: SOSForm }) => (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="#433bff" fontWeight="bold">
              {formatOutletName(form.outlet)}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleRead(form.id)}
              sx={{ minWidth: "auto", px: 2 }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Read
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "left" }}
          >
            {moment(form.createdAt).format("MMMM D, YYYY h:mm A")}
          </Typography>

          <Box display="flex" gap={3} justifyContent="center">
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Wine
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {form.wine}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Beer
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {form.beer}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Juice
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {form.juice}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            <strong>Email:</strong> {form.email}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  const MobileSkeletonCard = () => (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>

          <Skeleton variant="text" width="60%" height={20} />

          <Box display="flex" gap={3}>
            <Box textAlign="center">
              <Skeleton variant="text" width={40} height={16} />
              <Skeleton variant="text" width={30} height={28} />
            </Box>
            <Box textAlign="center">
              <Skeleton variant="text" width={40} height={16} />
              <Skeleton variant="text" width={30} height={28} />
            </Box>
            <Box textAlign="center">
              <Skeleton variant="text" width={40} height={16} />
              <Skeleton variant="text" width={30} height={28} />
            </Box>
          </Box>

          <Skeleton variant="text" width="80%" height={20} />
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col items-center justify-center relative">
      <Navbar />
      <div
        className={`flex flex-col items-center justify-center ${
          isMobile ? "p-4" : isTablet ? "p-6" : "p-10"
        } w-full text-center`}
      >
        <h1
          className={`${
            isMobile ? "text-[20px]" : "text-[24px]"
          } font-bold text-[#2F27CE] text-center ${
            isMobile ? "mb-6" : "mb-10"
          }`}
        >
          Overall SOS Forms
        </h1>

        <Box
          sx={{
            width: isMobile ? "95%" : isTablet ? "90%" : "80%",
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
            isDateFilterActive={!!dateRange.fromDate}
            isOutletFilterActive={!!selectedOutlet}
          />
        </Box>

        {isMobile ? (
          <Box
            sx={{
              width: "95%",
              maxWidth: "90vw",
              maxHeight: "60vh",
              overflow: "auto",
              backgroundColor: "white",
              borderRadius: "8px",
              p: 2,
            }}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <MobileSkeletonCard key={index} />
              ))
            ) : sosForms.length === 0 ? (
              <Typography>No forms found</Typography>
            ) : (
              sosForms.map((form) => <MobileCard key={form.id} form={form} />)
            )}
          </Box>
        ) : (
          <Box
            sx={{
              height: 500,
              width: isTablet ? "90%" : "80%",
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
        )}
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
