"use client";

import React from "react";
import { Button, Stack, Typography} from "@mui/material";
import { Shield, Trash2 } from "lucide-react";
import { useCommonUtils } from "@/app/hooks/useCommonUtils";
import Cookies from "js-cookie";

interface UserActionButtonsProps {
  user: {
    id: string;
    email: string;
    role: string;
  };
  currentUserEmail?: string;
  onRoleToggle: (id: string, newRole: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
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

export const UserActions: React.FC<UserActionButtonsProps> = ({
  user,
  currentUserEmail,
  onRoleToggle,
  onDelete,
}) => {
  const { openSnackbar, setLoading } = useCommonUtils();

  const handleRoleToggle = async () => {
    try {
      const newRole = user.role === "ADMIN" ? "MERCHANDISER" : "ADMIN";
      await onRoleToggle(user.id, newRole);

      if (user.email === currentUserEmail) {
        openSnackbar("Role changed successfully, logging out...", "success");
        setLoading(true);
        Cookies.remove("token");
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/pages/login";
        }, 1000);
      }
    } catch (err) {
      console.error("Error toggling role:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(user.id);

      if (user.email === currentUserEmail) {
        openSnackbar("Account deleted successfully, logging out...", "success");
        setLoading(true);
        Cookies.remove("token");
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/pages/login";
        }, 1000);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
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
        onClick={handleRoleToggle}
      >
        <Shield className="w-4 h-4" />
        <Typography variant="caption" sx={captionStyle}>
          {user.role === "ADMIN" ? "Merch" : "Admin"}
        </Typography>
      </Button>

      <Button
        size="medium"
        variant="text"
        sx={buttonStyle}
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4" />
        <Typography variant="caption" sx={captionStyle}>
          Delete
        </Typography>
      </Button>
    </Stack>
  );
};