"use client";

import { Button, Stack, Typography } from "@mui/material";
import { Filter, MapPin } from "lucide-react";

interface FiltersProps {
  selectedFilter: string;
  handleFilterClick: (filter: "Custom" | "Outlet") => void;
}

const Filters = ({ selectedFilter, handleFilterClick }: FiltersProps) => {
  const buttonStyles = {
    color: "#2d2d2d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: "100%",
    opacity: 0.6,
    border: "1px solid rgba(45, 45, 45, 0.1)",
    transition: "opacity 0.3s, background-color 0.3s",
    "&:hover": {
      opacity: 1,
      backgroundColor: "rgba(47, 39, 206, 0.04)",
    },
  };

  const filterButtons = [
    { label: "Custom", icon: <Filter size={20} /> },
    { label: "Outlet", icon: <MapPin size={20} /> },
  ];

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {filterButtons.map(({ label, icon }) => (
        <Button
          key={label}
          variant="outlined"
          size="small"
          onClick={() => handleFilterClick(label as "Custom" | "Outlet")}
          sx={{
            ...buttonStyles,
            borderColor: selectedFilter.startsWith(label)
              ? "#433BFF"
              : "rgba(45, 45, 45, 0.1)",
            color: selectedFilter.startsWith(label) ? "#433BFF" : "#2d2d2d",
            opacity: selectedFilter.startsWith(label) ? 1 : 0.6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            textTransform: "none",
            padding: "10px 16px",
          }}
        >
          {icon}
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {label}
          </Typography>
        </Button>
      ))}
    </Stack>
  );
};

export default Filters;