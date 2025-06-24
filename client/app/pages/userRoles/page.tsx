"use client";

import React from "react";
import Navbar from "@/components/frontend/Navbar";
import { Box, Chip, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useCommonUtils } from "@/app/hooks/useCommonUtils";
import { UserActions } from "@/components/frontend/UserActions"; 
import useRoleGuard from "@/app/hooks/useRoleGuard";
import {centerAligned } from "@/app/styles/styles";
import { apiUrl } from "@/app/utils/apiUrl";

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
      const res = await axios.get(apiUrl("user/configureUser"));
      return res.data;
    },
  });
};

const useToggleRole = () => {
  const { queryClient, openSnackbar, setLoading } = useCommonUtils();

  return useMutation<ToggleRoleResponse, Error, ToggleRoleParams>({
    mutationFn: async ({ id, role }) => {
      setLoading(true);
      const res = await axios.patch<ToggleRoleResponse>(apiUrl(
        `/user/configureUser/${id}/role`),
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
      const res = await axios.put(apiUrl(
        `/user/configureUser/${id}/soft-delete`)
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
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { data: users = [], isLoading } = useUsers();
  const toggleRole = useToggleRole();
  const softDeleteUser = useSoftDeleteUser();

  const [currentUser, setCurrentUser] = React.useState<{ email?: string }>({});

  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      ...centerAligned,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      ...centerAligned,
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
      ...centerAligned,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      ...centerAligned,
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

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#FAFAFF]">
        <Navbar />
        <div className="p-4">
          <h1 className="text-xl font-bold text-[#2F27CE] text-center mb-6 mt-20">
            User Roles
          </h1>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {user.email}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.createdAt}
                      </p>
                    </div>
                    <Chip
                      label={user.role === "ADMIN" ? "Admin" : "Merchandiser"}
                      size="small"
                      sx={{
                        backgroundColor: user.role === "ADMIN" ? "#E8F5E9" : "#FFF8E1",
                        color: user.role === "ADMIN" ? "#4CAF50" : "#FBC02D",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        ml: 2,
                      }}
                    />
                  </div>
                  
                  <div className="mt-5">
                    <UserActions
                      user={user}
                      currentUserEmail={currentUser.email}
                      onRoleToggle={async (id, newRole) => {
                        await toggleRole.mutateAsync({ id, role: newRole });
                      }}
                      onDelete={async (id) => {
                        await softDeleteUser.mutateAsync(id);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

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