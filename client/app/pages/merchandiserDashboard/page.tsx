"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import moment from "moment";
import Navbar from "@/components/frontend/Navbar";
import NameBlock from "@/components/frontend/NameBlock";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pencil, Eye, Trash2, Menu } from "lucide-react";
import {Box, Button, Stack, Typography, Card, CardContent, CardActions, useMediaQuery, useTheme, Collapse, IconButton, Skeleton,} from "@mui/material";
import { useCommonUtils } from "@/app/hooks/useCommonUtils";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { buttonStyle, captionStyle, centerAligned } from "@/app/styles/styles";
import { apiUrl } from "@/app/utils/apiUrl";
import { formatOutletName } from "@/app/utils/format";

type SOSForm = {
  id: string;
  outlet: string;
  wine: number;
  beer: number;
  juice: number;
  createdAt: string;
};

const getMerchandiserId = () => {
  if (typeof window === "undefined") return null;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || null;
};

const MobileFormCard = ({form,onEdit,onRead,onDelete,}: {
  form: SOSForm;
  onEdit: (id: string) => void;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {formatOutletName(form.outlet)}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <Menu size={18} />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {moment(form.createdAt).format("MMMM D, YYYY h:mm A")}
        </Typography>

        <Collapse in={expanded}>
          <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Wine
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {form.wine}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Beer
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {form.beer}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Juice
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {form.juice}
              </Typography>
            </Box>
          </Stack>
        </Collapse>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-around", pb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Pencil size={16} />}
          onClick={() => onEdit(form.id)}
          sx={{ minWidth: 80 }}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Eye size={16} />}
          onClick={() => onRead(form.id)}
          sx={{ minWidth: 80 }}
        >
          Read
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<Trash2 size={16} />}
          onClick={() => onDelete(form.id)}
          sx={{ minWidth: 80 }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

const MobileSkeletonCard = () => (
  <Card sx={{ mb: 2, boxShadow: 2 }}>
    <CardContent sx={{ pb: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton variant="text" width="50%" height={32} />
        <Skeleton variant="circular" width={24} height={24} />
      </Stack>

      <Skeleton variant="text" width="70%" height={20} sx={{ mt: 1 }} />
    </CardContent>

    <CardActions sx={{ justifyContent: "space-around", pb: 2 }}>
      <Skeleton variant="rectangular" width={80} height={32} />
      <Skeleton variant="rectangular" width={80} height={32} />
      <Skeleton variant="rectangular" width={80} height={32} />
    </CardActions>
  </Card>
);

export default function MerchandiserDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  useRoleGuard(["MERCHANDISER"]);
  const { openSnackbar, setLoading } = useCommonUtils();
  const queryClient = useQueryClient();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const {
    data: sosForms = [],
    isLoading,
  } = useQuery<SOSForm[]>({
    queryKey: ["sosForms"],
    queryFn: async () => {
      const merchandiserId = getMerchandiserId();
      const res = await axios.get(apiUrl("/user/sosform"), {
        withCredentials: true,
        params: { merchandiserId },
      });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!getMerchandiserId(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.put(
        apiUrl(`/user/sosform/softDelete/${id}`),
        {},
        { withCredentials: true }
      ),
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

  const handleSoftDelete = (id: string) => deleteMutation.mutate(id);
  const handleRead = (id: string) => router.push(`/pages/conforme?id=${id}&readonly=true`);
  const handleEdit = (id: string) => router.push(`/pages/createForm?id=${id}&edit=true`);

  const rows = sosForms.map((form) => ({
    id: form.id,
    outlet: formatOutletName(form.outlet),
    createdAt: moment(form.createdAt).format("MMMM D, YYYY h:mm A"),
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
          <Button size="medium" variant="text" sx={buttonStyle} onClick={() => handleEdit(params.row.id)}>
            <Pencil className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>Edit</Typography>
          </Button>
          <Button size="medium" variant="text" sx={buttonStyle} onClick={() => handleRead(params.row.id)}>
            <Eye className="w-4 h-4" />
            <Typography variant="caption" sx={captionStyle}>Read</Typography>
          </Button>
          <Button size="medium" variant="text" sx={buttonStyle} onClick={() => handleSoftDelete(params.row.id)}>
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
      <div
        className={`flex flex-col items-center justify-center w-full text-center ${
          isMobile ? "p-4" : "p-10"
        }`}
      >
        <div className={`mb-6 w-full ${isMobile ? "max-w-sm mt-20" : "max-w-md"}`}>
          <NameBlock />
        </div>

        {isMobile ? (
          <Box sx={{ width: "100%", maxWidth: "500px", px: 2 }}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <MobileSkeletonCard key={index} />
              ))
            ) : sosForms.length === 0 ? (
              <Typography>No SOS forms found</Typography>
            ) : (
              sosForms.map((form) => (
                <MobileFormCard
                  key={form.id}
                  form={form}
                  onEdit={handleEdit}
                  onRead={handleRead}
                  onDelete={handleSoftDelete}
                />
              ))
            )}
          </Box>
        ) : (
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
        )}
      </div>
    </div>
  );
}