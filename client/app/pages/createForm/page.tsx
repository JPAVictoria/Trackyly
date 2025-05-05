"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/frontend/Navbar";
import { Button } from "@mui/material";
import useRoleGuard from "@/app/hooks/useRoleGuard";

const buttonStyles = {
  backgroundColor: "#fff",
  color: "#000",
  borderColor: "rgba(45, 45, 45, 0.1)",
  textTransform: "none",
  fontSize: "0.75rem",
  padding: "4px 10px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "rgba(45, 45, 45, 0.2)",
  },
};

export default function CreateForm() {

    useRoleGuard(["MERCHANDISER"]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9fc] px-4 py-10">
      <Navbar />
      <h2 className="text-xl font-bold text-[#2F27CE] mb-10">
        Create/Update SOS Form
      </h2>

      <div className="w-full max-w-xl rounded-sm border border-gray-200 shadow-sm bg-white p-8">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="time-in"
              className="text-[#2d2d2d] mb-2 font-medium"
            >
              Actual Time-in
            </Label>
            <Input
              id="time-in"
              type="text"
              value="04/20/2025 03:42:42 PM"
              className="mt-1 text-[#6b7280] border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed transition-all duration-300 focus:outline-none"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="outlet" className="text-[#2d2d2d] mb-2 font-medium">
              Outlet
            </Label>
            <Select>
              <SelectTrigger
                id="outlet"
                className="mt-1 w-full cursor-pointer focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300 data-[state=open]:ring-1 data-[state=open]:ring-[#2F27CE]"
              >
                <SelectValue placeholder="Choose an outlet" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#2d2d2d]/50 shadow-md">
                <SelectItem 
                  value="outlet-a" 
                  className="cursor-pointer hover:bg-[#2F27CE]/10"
                >
                  Outlet A
                </SelectItem>
                <SelectItem 
                  value="outlet-b" 
                  className="cursor-pointer hover:bg-[#2F27CE]/10"
                >
                  Outlet B
                </SelectItem>
                <SelectItem 
                  value="outlet-c" 
                  className="cursor-pointer hover:bg-[#2F27CE]/10"
                >
                  Outlet C
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-y-4">
            <p className="col-start-2 text-[#2F27CE] text-sm italic text-center -ml-30 mb-2">
              Number of facings
            </p>

            <div className="col-span-3 flex items-center justify-center gap-4">
              <Label className="w-32 text-[#2d2d2d] font-semibold">
                Total Beverages
              </Label>
              <Input
                type="number"
                readOnly
                className="flex-1 max-w-sm text-[#6b7280] border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed transition-all duration-300 focus:outline-none"
              />
            </div>

            {["Wine", "Beer", "Juice"].map((label) => (
              <div
                key={label}
                className="col-span-3 flex items-center justify-center gap-4"
              >
                <Label className="w-32 text-[#2d2d2d] font-normal">
                  {label}
                </Label>
                <Input
                  type="number"
                  className="flex-1 max-w-sm transition-all duration-300 focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button sx={buttonStyles} variant="outlined">
              Move to confirmation →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}