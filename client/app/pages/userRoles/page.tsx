"use client";

import React from "react";
import Navbar from "@/components/frontend/Navbar";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useCommonUtils } from "@/app/hooks/useCommonUtils";
import { UserActions } from "@/components/frontend/UserActions"; 
import useRoleGuard from "@/app/hooks/useRoleGuard";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ToggleRoleParams {
  id: string;
  role: string;
}

interface ToggleRoleResponse {
  success: boolean;
  newRole: string;
}

const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/user/configureUser");
      return res.data;
    },
  });
};

const useToggleRole = () => {
  const { queryClient, openSnackbar, setLoading } = useCommonUtils();

  return useMutation<ToggleRoleResponse, Error, ToggleRoleParams>({
    mutationFn: async ({ id, role }) => {
      setLoading(true);
      const res = await axios.patch<ToggleRoleResponse>(
        `http://localhost:5000/user/configureUser/${id}/role`,
        { role }
      );
      return res.data;
    },
    onSuccess: (data) => {
      const newRole = data.newRole === "ADMIN" ? "Admin" : "Merchandiser";
      openSnackbar(`Role changed to ${newRole} successfully`, "success");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setLoading(false);
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      openSnackbar("Error updating role", "error");
      setLoading(false);
    },
  });
};

const useSoftDeleteUser = () => {
  const { queryClient, openSnackbar, setLoading } = useCommonUtils();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/user/configureUser/${id}/soft-delete`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      openSnackbar("User deleted successfully", "success");
      setLoading(false);
    },
    onError: (error) => {
      console.error("Error soft deleting user:", error);
      openSnackbar("Error deleting user", "error");
      setLoading(false);
    },
  });
};

export default function UserRoles() {

  useRoleGuard(["ADMIN"]);
  
  const { data: users = [], isLoading } = useUsers();
  const toggleRole = useToggleRole();
  const softDeleteUser = useSoftDeleteUser();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") as { email?: string };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });

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
      renderCell: (params) => {
        const role = params.value;
        let chipProps;

        switch (role) {
          case "ADMIN":
            chipProps = {
              label: "Admin",
              sx: {
                backgroundColor: "#E8F5E9",
                color: "#4CAF50",
                fontWeight: 500,
                fontSize: "0.75rem",
                textTransform: "capitalize",
              },
            };
            break;
          case "MERCHANDISER":
          default:
            chipProps = {
              label: "Merchandiser",
              sx: {
                backgroundColor: "#FFF8E1",
                color: "#FBC02D",
                fontWeight: 500,
                fontSize: "0.75rem",
                textTransform: "capitalize",
              },
            };
            break;
        }

        return <Chip size="medium" {...chipProps} />;
      },
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
      renderCell: (params) => {
        const row = params.row as User;
        return (
          <UserActions
            user={row}
            currentUserEmail={currentUser.email}
            onRoleToggle={async (id, newRole) => {
              await toggleRole.mutateAsync({ id, role: newRole });
            }}
            onDelete={async (id) => {
              await softDeleteUser.mutateAsync(id);
            }}
          />
        );
      },
    },
  ];

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
            rows={users}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            rowHeight={75}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            loading={isLoading}
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