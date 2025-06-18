"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import { buttonStylesFilter } from "@/app/styles/styles";

interface DateFilterModal {
  open: boolean;
  onClose: () => void;
  onApply: (fromDate: Moment | null, toDate: Moment | null) => void;
  initialFromDate?: Moment | null;
  initialToDate?: Moment | null;
}

export default function DateFilterModal({
  open,
  onClose,
  onApply,
  initialFromDate = null,
  initialToDate = null,
}: DateFilterModal) {
  const [fromDate, setFromDate] = useState<Moment | null>(initialFromDate);
  const [toDate, setToDate] = useState<Moment | null>(initialToDate);

  useEffect(() => {
    if (open) {
      setFromDate(initialFromDate);
      setToDate(initialToDate);
    }
  }, [open, initialFromDate, initialToDate]);

  const handleApply = () => {
    onApply(fromDate, toDate);
    onClose();
  };

  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
  };

  const handleClose = () => {
    setFromDate(initialFromDate);
    setToDate(initialToDate);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-bold text-[#433BFF]">
        Custom Date Range
      </DialogTitle>
      <DialogContent className="p-6">
        <LocalizationProvider dateAdapter={AdapterMoment}>
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
        <Button onClick={handleClose} {...buttonStylesFilter}>
          Cancel
        </Button>
        <Button onClick={handleClear} {...buttonStylesFilter}>
          Clear
        </Button>
        <Button onClick={handleApply} {...buttonStylesFilter}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}