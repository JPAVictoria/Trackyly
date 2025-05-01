"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useDateStore } from "@/app/stores/useDateStore";

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
  const { fromDate, toDate, setFromDate, setToDate, resetDates } = useDateStore();

  const handleApply = () => {
    onApply(fromDate, toDate);
    onClose();
  };

  const handleClear = () => {
    resetDates();
  };

  const buttonStyles = {
    variant: "outlined" as const,
    sx: {
      borderColor: "#2d2d2d",
      color: "#2d2d2d",
      padding: "8px 16px",
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
          <Box className="flex flex-col gap-6 mt-4">
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.87)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#433BFF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      '&.Mui-focused': {
                        color: '#433BFF',
                      },
                    },
                  },
                } 
              }}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={setToDate}
              minDate={fromDate ?? undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.87)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#433BFF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      '&.Mui-focused': {
                        color: '#433BFF',
                      },
                    },
                  },
                }
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