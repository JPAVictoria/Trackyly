"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns"; 

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

  const searchParams = useSearchParams();

  useEffect(() => {
    const wineFromQuery = Number(searchParams.get("wine"));
    const beerFromQuery = Number(searchParams.get("beer"));
    const juiceFromQuery = Number(searchParams.get("juice"));
    const outletFromQuery = searchParams.get("outlet");
  
    if (!isNaN(wineFromQuery)) setWine(wineFromQuery);
    if (!isNaN(beerFromQuery)) setBeer(beerFromQuery);
    if (!isNaN(juiceFromQuery)) setJuice(juiceFromQuery);
    if (outletFromQuery) setOutlet(outletFromQuery);
  }, [searchParams]);
  

  const [wine, setWine] = useState<number>(0);
  const [beer, setBeer] = useState<number>(0);
  const [juice, setJuice] = useState<number>(0);
  const [outlet, setOutlet] = useState<string>("");
  
  const [timeIn] = useState(() => {
    const now = new Date();
    return format(now, "MMMM dd, yyyy hh:mm a"); // e.g., August 28, 2005 02:30 PM
  });

  const totalBeverages = wine + beer + juice;

  const router = useRouter();

  const isFormComplete = useMemo(() => {
    const isValidNumber = (val: number) => !isNaN(val) && val >= 0;
    return (
      outlet.trim() !== "" &&
      isValidNumber(wine) &&
      isValidNumber(beer) &&
      isValidNumber(juice)
    );
  }, [outlet, wine, beer, juice]);

  const handleMoveToConfirmation = () => {
    const formData = {
      wine: String(wine),
      beer: String(beer),
      juice: String(juice),
      outlet,
      total: String(totalBeverages),
      timeIn,
    };

    router.push(`/pages/conforme?${new URLSearchParams(formData).toString()}`);
  };

  const outlets = ["PARANAQUE_CITY", "MUNTINLUPA_CITY", "QUEZON_CITY"];

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
              value={timeIn}
              className="mt-1 text-[#6b7280] border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed transition-all duration-300 focus:outline-none"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="outlet" className="text-[#2d2d2d] mb-2 font-medium">
              Outlet
            </Label>
            <Select value={outlet} onValueChange={setOutlet}>
            <SelectTrigger
                id="outlet"
                className="mt-1 w-full cursor-pointer focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300 data-[state=open]:ring-1 data-[state=open]:ring-[#2F27CE]"
              >
                <SelectValue placeholder="Choose an outlet" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#2d2d2d]/50 shadow-md">
                {outlets.map((outletValue) => (
                  <SelectItem
                    key={outletValue}
                    value={outletValue}
                    className="cursor-pointer hover:bg-[#2F27CE]/10"
                  >
                    {outletValue.replace("_", " ")}
                  </SelectItem>
                ))}
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
                type="text"
                value={totalBeverages.toLocaleString()}
                readOnly
                className="flex-1 max-w-sm text-[#6b7280] font-bold border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed transition-all duration-300 focus:outline-none text-center"
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
                  type="text"
                  value={label === "Wine" ? wine.toLocaleString() : label === "Beer" ? beer.toLocaleString() : juice.toLocaleString()}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value.replace(/,/g, ""));
                    if (isNaN(numericValue)) return;
                    if (label === "Wine") setWine(numericValue);
                    else if (label === "Beer") setBeer(numericValue);
                    else setJuice(numericValue);
                  }}
                  className="flex-1 max-w-sm transition-all duration-300 focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 text-center"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              sx={buttonStyles}
              variant="outlined"
              onClick={handleMoveToConfirmation}
              disabled={!isFormComplete}
            >
              Move to confirmation →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
