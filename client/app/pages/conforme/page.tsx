"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { useLoading } from "@/app/context/loaderContext";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useAuthStore } from "@/app/stores/useAuthStore"
import axios from "axios";
import { buttonStyles } from "@/app/styles/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/app/utils/apiUrl";
import moment from "moment";
import {formatNumber, formatOutletName} from "@/app/utils/format";

interface FormData {
  wine: number;
  beer: number;
  juice: number;
  outlet: string;
  timeIn: string;
  merchandiserId: string;
}

interface SOSFormResponse extends FormData {
  id: string;
  createdAt: string;
}

const parseQueryParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    id: queryParams.get("id"),
    isReadOnly: queryParams.get("readonly") === "true",
    isEdit: queryParams.get("edit") === "true",
    fromConforme: queryParams.get("fromConforme") === "true",
    formData: {
      wine: Number(queryParams.get("wine") || 0),
      beer: Number(queryParams.get("beer") || 0),
      juice: Number(queryParams.get("juice") || 0),
      outlet: queryParams.get("outlet") || "",
      timeIn: queryParams.get("timeIn") || "",
      merchandiserId: queryParams.get("merchandiserId") || ""
    }
  };
};

export default function Conforme() {
  useRoleGuard(["MERCHANDISER", "ADMIN"]);

  const router = useRouter();
  const { setLoading } = useLoading();
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  
  const { role: userRole, _hasHydrated } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    wine: 0,
    beer: 0,
    juice: 0,
    outlet: "",
    timeIn: "",
    merchandiserId: ""
  });

  const [pageState, setPageState] = useState({
    isEdit: false,
    isReadOnly: false,
    formId: null as string | null,
  });

  const [checkboxes, setCheckboxes] = useState([false, false, false, false]);

  const totalBeverages = useMemo(() => 
    formData.wine + formData.beer + formData.juice, 
    [formData.wine, formData.beer, formData.juice]
  );

  const allCheckboxesChecked = useMemo(() => 
    checkboxes.every(Boolean), 
    [checkboxes]
  );

  const { data: existingFormData } = useQuery<SOSFormResponse, Error>({
    queryKey: ["sosForm", pageState.formId],
    queryFn: async () => {
      if (!pageState.formId) throw new Error("No form ID provided");
      const response = await axios.get(apiUrl(`/user/sosform/${pageState.formId}`));
      return response.data;
    },
    enabled: (pageState.isReadOnly || pageState.isEdit) && !!pageState.formId,
  });

  useEffect(() => {
    
    if (!_hasHydrated) return;

    setLoading(false);
    
    const params = parseQueryParams();
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    setPageState({
      isEdit: params.isEdit,
      isReadOnly: params.isReadOnly,
      formId: params.id,
    });

    
    if (params.isReadOnly && existingFormData) {
      setFormData({
        wine: existingFormData.wine,
        beer: existingFormData.beer,
        juice: existingFormData.juice,
        outlet: existingFormData.outlet,
        timeIn: moment(existingFormData.createdAt).format("MMM D, YYYY h:mm A"),
        merchandiserId: existingFormData.merchandiserId
      });
      setCheckboxes([true, true, true, true]);
    } else if (!params.isReadOnly) {
      setFormData({
        ...params.formData,
        merchandiserId: params.formData.merchandiserId || user?.id || ""
      });
    }
  }, [existingFormData, setLoading, _hasHydrated]);

  
  const submitFormMutation = useMutation({
    mutationFn: async (payload: Omit<FormData, 'timeIn'> & { createdAt: string }) => {
      const endpoint = pageState.isEdit && pageState.formId 
        ? `/user/sosform/${pageState.formId}` 
        : "/user/sosform";
      
      const method = pageState.isEdit ? axios.put : axios.post;
      return method(apiUrl(endpoint), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sosForms"] });
      openSnackbar(
        pageState.isEdit ? "Form updated successfully!" : "Form submitted successfully!",
        "success"
      );
      router.push("/pages/merchandiserDashboard");
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      openSnackbar("Failed to submit the form. Please try again.", "error");
    },
  });

  const handleCheckboxChange = (index: number) => {
    if (pageState.isReadOnly) return;
    setCheckboxes(prev => prev.map((checked, i) => i === index ? !checked : checked));
  };

  const handleGoBack = () => {
    const queryParams = new URLSearchParams({
      wine: formData.wine.toString(),
      beer: formData.beer.toString(),
      juice: formData.juice.toString(),
      outlet: formData.outlet,
      total: totalBeverages.toString(),
      timeIn: formData.timeIn,
      fromConforme: "true",
    });

    if (pageState.isEdit && pageState.formId) {
      queryParams.append("edit", "true");
      queryParams.append("id", pageState.formId);
    }

    router.push(`/pages/createForm?${queryParams.toString()}`);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        merchandiserId: formData.merchandiserId,
        outlet: formData.outlet,
        wine: formData.wine,
        beer: formData.beer,
        juice: formData.juice,
        createdAt: moment().toISOString(),
      };

      await submitFormMutation.mutateAsync(payload);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    const destination = userRole === "ADMIN" 
      ? "/pages/forms" 
      : "/pages/merchandiserDashboard";
    router.push(destination);
  };

  const checkboxTexts = [
    "All information provided in this form is complete, true, and correct to the best of my knowledge",
    "All reimbursement regarding transportation and other valid expenses are accurate",
    "I understand that any false information provided might lead to the disapproval of any related reimbursement and that it may be grounds for demerit, suspension, or even termination of employment",
    "All information provided in this form was reviewed before submission.",
  ];

  return (
    <div className="min-h-screen bg-[#f9f9fb] flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-bold text-[#2F27CE] mb-10">
        Summary & Conformé
      </h1>

      <div className="rounded-sm border border-gray-200 shadow-sm bg-white w-full max-w-2xl p-10 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium mb-7">
          <div className="text-center">
            <p className="text-[#2d2d2d] font-semibold mb-2">Actual Time-in</p>
            <p className="text-[#2d2d2d] font-normal">{formData.timeIn}</p>
          </div>
          <div className="text-center">
            <p className="text-[#2d2d2d] font-semibold mb-2">Outlet</p>
            <p className="text-[#2d2d2d] font-normal">
              {formatOutletName(formData.outlet)}
            </p>
          </div>
        </div>
        <div className="text-center mt-6 mb-5 space-y-4 text-[#2d2d2d]">
          <p className="font-semibold text-sm">Input Details</p>
          <p className="text-sm">Total Beverages - {formatNumber(totalBeverages)}</p>
          <p className="text-sm">Wine - {formatNumber(formData.wine)}</p>
          <p className="text-sm">Beer - {formatNumber(formData.beer)}</p>
          <p className="text-sm">Juice - {formatNumber(formData.juice)}</p>
        </div>

        <hr className="my-4 opacity-20" />

        <div className="space-y-4 text-[12px]">
          {checkboxTexts.map((text, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1 cursor-pointer"
                checked={checkboxes[idx]}
                disabled={pageState.isReadOnly}
                onChange={() => handleCheckboxChange(idx)}
              />
              <label className="text-[#2d2d2d]">{text}</label>
            </div>
          ))}
        </div>

        {!pageState.isReadOnly && (
          <div className="flex justify-between items-center pt-6">
            <Button sx={buttonStyles} variant="outlined" onClick={handleGoBack}>
              ← Go back
            </Button>
            <Button
              sx={buttonStyles}
              variant="outlined"
              onClick={handleSubmit}
              disabled={!allCheckboxesChecked || submitFormMutation.isPending}
            >
              {submitFormMutation.isPending
                ? "Processing..."
                : pageState.isEdit
                ? "Update"
                : "Submit"}
            </Button>
          </div>
        )}

        {pageState.isReadOnly && (
          <div className="flex justify-end pt-6">
            <Button
              sx={buttonStyles}
              variant="outlined"
              onClick={handleBackToDashboard}
            >
              ← Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}