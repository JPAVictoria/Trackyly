"use client";

import { Button, Stack, Typography } from "@mui/material";
import { Filter, MapPin } from "lucide-react";
import { baseButtonStyles } from "@/app/styles/styles";

interface FiltersProps {
  selectedFilter: string;
  handleFilterClick: (filter: "Custom" | "Outlet") => void;
  isDateFilterActive: boolean;
  isOutletFilterActive: boolean;
}

const Filters = ({
  handleFilterClick,
  isDateFilterActive,
  isOutletFilterActive,
}: FiltersProps) => {
  const filterButtons = [
    {
      label: "Custom",
      icon: <Filter size={20} />,
      isActive: isDateFilterActive,
    },
    {
      label: "Outlet",
      icon: <MapPin size={20} />,
      isActive: isOutletFilterActive,
    },
  ];

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {filterButtons.map(({ label, icon, isActive }) => (
        <Button
          key={label}
          variant="outlined"
          size="small"
          onClick={() => handleFilterClick(label as "Custom" | "Outlet")}
          sx={{
            ...baseButtonStyles,
            borderColor: isActive ? "#433BFF" : "rgba(45, 45, 45, 0.1)",
            color: isActive ? "#433BFF" : "#2d2d2d",
            opacity: isActive ? 1 : 0.6,
            "&:hover": {
              opacity: 1,
              backgroundColor: "rgba(47, 39, 206, 0.04)",
            },
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
