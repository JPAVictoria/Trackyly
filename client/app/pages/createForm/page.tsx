"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { format } from "date-fns";
import axios from "axios";

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
  const isEditMode = searchParams.get("edit") === "true";
  const formId = searchParams.get("id");

  const [wine, setWine] = useState<number>(0);
  const [beer, setBeer] = useState<number>(0);
  const [juice, setJuice] = useState<number>(0);
  const [outlet, setOutlet] = useState<string>("");
  const [timeIn, setTimeIn] = useState<string>("");

  useEffect(() => {
    // Check if the form is in edit mode
    if (isEditMode && formId) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/user/sosform/${formId}`,
            { withCredentials: true }
          );
          setWine(data.wine || 0);
          setBeer(data.beer || 0);
          setJuice(data.juice || 0);
          setOutlet(data.outlet || "");
          setTimeIn(format(new Date(data.createdAt), "MMMM dd, yyyy hh:mm a")); 
        } catch (error) {
          console.error("Failed to fetch form data:", error);
        }
      };

      fetchData();
    } else {
      const now = new Date();
      setTimeIn(format(now, "MMMM dd, yyyy hh:mm a"));
    }
  }, [isEditMode, formId]);

  const router = useRouter();

  const totalBeverages = wine + beer + juice;

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
    const params = new URLSearchParams({
      wine: String(wine),
      beer: String(beer),
      juice: String(juice),
      outlet,
      total: String(totalBeverages),
      timeIn,
    });

    // Add edit info if applicable
    if (isEditMode && formId) {
      params.append("edit", "true");
      params.append("id", formId);
    }

    router.push(`/pages/conforme?${params.toString()}`);
  };

  const outlets = ["PARANAQUE_CITY", "MUNTINLUPA_CITY", "QUEZON_CITY"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9fc] px-4 py-10">
      <Navbar />
      <h2 className="text-xl font-bold text-[#2F27CE] mb-10">
        {isEditMode ? "Update SOS Form" : "Create SOS Form"}
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
              readOnly
              className="mt-1 text-[#6b7280] border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed transition-all duration-300 focus:outline-none"
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
                    {" "}
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
                className="flex-1 max-w-sm text-[#6b7280] font-bold border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed text-center"
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
                  value={
                    label === "Wine"
                      ? wine.toLocaleString()
                      : label === "Beer"
                      ? beer.toLocaleString()
                      : juice.toLocaleString()
                  }
                  onChange={(e) => {
                    const numericValue = Number(
                      e.target.value.replace(/,/g, "")
                    );
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
