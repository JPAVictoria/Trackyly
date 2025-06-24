"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Input } from "@/components/ui/input";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem,} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/frontend/Navbar";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import moment from "moment";
import axios from "axios";
import { buttonStyles } from "@/app/styles/styles";
import { apiUrl } from "@/app/utils/apiUrl";

interface FormData {
  wine: number;
  beer: number;
  juice: number;
  outlet: string;
  timeIn: string;
}

const parseQueryParams = (searchParams: URLSearchParams) => {
  return {
    isEdit: searchParams.get("edit") === "true",
    formId: searchParams.get("id"),
    fromConforme: searchParams.get("fromConforme") === "true",
    formData: {
      wine: Number(searchParams.get("wine") || 0),
      beer: Number(searchParams.get("beer") || 0),
      juice: Number(searchParams.get("juice") || 0),
      outlet: searchParams.get("outlet") || "",
      timeIn: searchParams.get("timeIn") || moment().format("MMMM DD, YYYY h:mm A"),
    },
  };
};

function CreateForm() {
  useRoleGuard(["MERCHANDISER"]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    wine: 0,
    beer: 0,
    juice: 0,
    outlet: "",
    timeIn: moment().format("MMMM DD, YYYY h:mm A"),
  });

  const [pageState, setPageState] = useState<{
    isEdit: boolean;
    formId: string | null;
    fromConforme: boolean;
  }>({ isEdit: false, formId: null, fromConforme: false });

  useEffect(() => {
    const params = parseQueryParams(searchParams);
    setPageState({
      isEdit: params.isEdit,
      formId: params.formId,
      fromConforme: params.fromConforme,
    });

    const initializeForm = async () => {
      try {
        if (params.isEdit && !params.fromConforme && params.formId) {
          const { data } = await axios.get(apiUrl(`/user/sosform/${params.formId}`), {
            withCredentials: true,
          });

          setFormData({
            wine: data.wine || 0,
            beer: data.beer || 0,
            juice: data.juice || 0,
            outlet: data.outlet || "",
            timeIn: moment(data.createdAt).format("MMMM DD, YYYY h:mm A"),
          });
        } else {
          setFormData(params.formData);
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      }
    };

    initializeForm();
  }, [searchParams]);

  const totalBeverages = useMemo(
    () => formData.wine + formData.beer + formData.juice,
    [formData]
  );

  const isFormComplete = useMemo(() => {
    const isValid = (val: number) => !isNaN(val) && val >= 0;
    return (
      formData.outlet.trim() !== "" &&
      isValid(formData.wine) &&
      isValid(formData.beer) &&
      isValid(formData.juice)
    );
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "number" ? Math.max(0, value) : value,
    }));
  };

  const handleMoveToConfirmation = () => {
    const params = new URLSearchParams({
      wine: String(formData.wine),
      beer: String(formData.beer),
      juice: String(formData.juice),
      outlet: formData.outlet,
      total: String(totalBeverages),
      timeIn: formData.timeIn,
    });

    if (pageState.isEdit && pageState.formId) {
      params.append("edit", "true");
      params.append("id", pageState.formId);
    }

    router.push(`/pages/conforme?${params.toString()}`);
  };

  const outlets = ["PARANAQUE_CITY", "MUNTINLUPA_CITY", "QUEZON_CITY"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9fc] px-4 sm:px-4 py-10">
      <Navbar />
      <h2 className="text-lg sm:text-xl font-bold text-[#2F27CE] mb-6 sm:mb-10 text-center px-2">
        {pageState.isEdit ? "Update SOS Form" : "Create SOS Form"}
      </h2>

      <div className="w-full max-w-xl rounded-sm border border-gray-200 shadow-sm bg-white p-4 sm:p-8 space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="time-in" className="text-[#2d2d2d] mb-2 font-medium text-sm sm:text-base">
            Actual Time-in
          </Label>
          <Input
            id="time-in"
            type="text"
            value={formData.timeIn}
            readOnly
            className="mt-1 text-[#6b7280] border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed transition-all duration-300 focus:outline-none text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="outlet" className="text-[#2d2d2d] mb-2 font-medium text-sm sm:text-base">
            Outlet
          </Label>
          <Select value={formData.outlet} onValueChange={(val) => handleInputChange("outlet", val)}>
            <SelectTrigger
              id="outlet"
              className="mt-1 w-full cursor-pointer focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300 data-[state=open]:ring-1 data-[state=open]:ring-[#2F27CE] text-sm sm:text-base"
            >
              <SelectValue placeholder="Choose an outlet" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#2d2d2d]/50 shadow-md">
              {outlets.map((outletVal) => (
                <SelectItem key={outletVal} value={outletVal} className="cursor-pointer hover:bg-[#2F27CE]/10 text-sm sm:text-base">
                  {outletVal.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-y-4">
          <p className="col-start-2 text-[#2F27CE] text-xs sm:text-sm italic text-center -ml-30 mb-2">
            Number of facings
          </p>

          <div className="col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4">
            <Label className="w-full sm:w-32 text-[#2d2d2d] font-semibold text-sm sm:text-base">Total Beverages</Label>
            <Input
              type="text"
              value={totalBeverages.toLocaleString()}
              readOnly
              className="w-full sm:flex-1 sm:max-w-sm text-[#6b7280] font-bold border border-[#2d2d2d]/50 bg-transparent cursor-not-allowed text-center text-sm sm:text-base"
            />
          </div>

          {["wine", "beer", "juice"].map((type) => (
            <div key={type} className="col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4">
              <Label className="w-full sm:w-32 text-[#2d2d2d] font-normal text-sm sm:text-base">{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
              <Input
                type="text"
                value={formData[type as keyof FormData].toLocaleString()}
                onChange={(e) => {
                  const num = Number(e.target.value.replace(/,/g, ""));
                  if (!isNaN(num)) handleInputChange(type as keyof FormData, num);
                }}
                className="w-full sm:flex-1 sm:max-w-sm transition-all duration-300 focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 text-center text-sm sm:text-base"
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
  );
}

export default function CreateFormWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateForm />
    </Suspense>
  );
}