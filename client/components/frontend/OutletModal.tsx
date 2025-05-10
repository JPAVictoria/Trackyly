"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  Box,
} from "@mui/material";
import { buttonStylesFilter} from "@/app/styles/styles"; 

enum Outlet {
  PARANAQUE_CITY = "PARANAQUE_CITY",
  MUNTINLUPA_CITY = "MUNTINLUPA_CITY",
  QUEZON_CITY = "QUEZON_CITY",
}

interface OutletModalProps {
  open: boolean;
  onClose: () => void;
  onSelectOutlet: (outlet: string | null) => void;
  selectedOutlet: string | null;
}


export default function OutletModal({
  open,
  onClose,
  onSelectOutlet,
  selectedOutlet: selectedOutletProp, 
}: OutletModalProps) {
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedOutlet(selectedOutletProp);
    }
  }, [open, selectedOutletProp]);


  const handleApply = () => {
    onSelectOutlet(selectedOutlet);
    setSelectedOutlet(null);
    onClose();
  };

  const handleClear = () => {
    setSelectedOutlet(null);
  };


  const formatOutletName = (outlet: string) => {
    return outlet
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-bold text-[#433BFF]">
        Select Outlet
      </DialogTitle>
      <DialogContent className="p-6">
        <Box className="flex flex-col gap-6">
          <FormControl fullWidth>
            <Select
              value={selectedOutlet || ''}
              onChange={(e) => setSelectedOutlet(e.target.value as string)}
              displayEmpty
              inputProps={{ 'aria-label': 'Select outlet' }}
              renderValue={(selected) => selected ? formatOutletName(selected as string) : "Select an outlet"}
              sx={{
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
              }}
            >
              {Object.values(Outlet).map((outlet) => (
                <MenuItem key={outlet} value={outlet}>
                  {formatOutletName(outlet)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions className="p-4 gap-2">
        <Button onClick={onClose} {...buttonStylesFilter}>
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