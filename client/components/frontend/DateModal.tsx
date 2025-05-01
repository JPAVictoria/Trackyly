"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextFieldProps,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface CustomFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (fromDate: Date | null, toDate: Date | null) => void;
}

export default function CustomFilterModal({
  open,
  onClose,
  onApply,
}: CustomFilterModalProps) {
  const [fromDate, setFromDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [toDate, setToDate] = useState<Date | null>(new Date());

  const handleApply = () => {
    onApply(fromDate, toDate);
    onClose();
  };

  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
  };

  const buttonStyles = {
    variant: "outlined" as const,
    sx: {
      borderColor: "#2d2d2d",
      color: "#2d2d2d",
      padding: "4px 6px",
      fontSize: "0.8125rem", 
      textTransform: "none",
      "&:hover": {
        borderColor: "#433BFF",
        color: "#433BFF",
        backgroundColor: "#433BFF10",
      },
    },
  };
  
  const applyButtonStyles = {
    ...buttonStyles,
    sx: {
      ...buttonStyles.sx,
      borderColor: "#433BFF",
      color: "#433BFF",
      "&:hover": {
        borderColor: "#433BFF",
        backgroundColor: "#433BFF10",
      },
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-bold text-[#433BFF]">
        Custom Date Range
      </DialogTitle>
      <DialogContent className="p-6">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box className="flex flex-col gap-6">
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue: Date | null) => setFromDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                } as TextFieldProps,
              }}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue: Date | null) => setToDate(newValue)}
              minDate={fromDate ?? undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                } as TextFieldProps,
              }}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions className="p-4 gap-2">
        <Button onClick={onClose} {...buttonStyles}>
          Cancel
        </Button>
        <Button onClick={handleClear} {...buttonStyles}>
          Clear
        </Button>
        <Button onClick={handleApply} {...applyButtonStyles}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}