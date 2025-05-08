"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import useRoleGuard from "@/app/hooks/useRoleGuard";
import { useLoading } from "@/app/context/loaderContext";
import { useSnackbar } from "@/app/context/SnackbarContext";
import axios from "axios";
import { buttonStyles } from "@/app/styles/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FormData {
  wine: string | null;
  beer: string | null;
  juice: string | null;
  outlet: string | null;
  total: string | null;
  timeIn: string | null;
  merchandiserId: string | null;
}

interface SOSFormResponse {
  id: string;
  wine: number;
  beer: number;
  juice: number;
  outlet: string;
  createdAt: string;
  merchandiserId: string;
}

export default function Conforme() {
  useRoleGuard(["MERCHANDISER", "ADMIN"]);

  const router = useRouter();
  const { setLoading } = useLoading();
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    wine: null,
    beer: null,
    juice: null,
    outlet: null,
    total: null,
    timeIn: null,
    merchandiserId: null,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [checkboxes, setCheckboxes] = useState([false, false, false, false]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const formatOutletName = (outlet: string | null): string => {
    if (!outlet) return "";
    return outlet.replace(/_/g, " ").toUpperCase();
  };
  
  

  const { data: readonlyFormData } = useQuery<SOSFormResponse, Error>({
    queryKey: ["sosForm", formId],
    queryFn: async () => {
      if (!formId) throw new Error("No form ID provided");
      const response = await axios.get(`http://localhost:5000/user/sosform/${formId}`);
      return response.data;
    },
    enabled: isReadOnly && !!formId,
  });
  
  useEffect(() => {
    setLoading(false);
    if (readonlyFormData) {
      setFormData({
        wine: readonlyFormData.wine.toString(),
        beer: readonlyFormData.beer.toString(),
        juice: readonlyFormData.juice.toString(),
        outlet: readonlyFormData.outlet,
        total: (readonlyFormData.wine + readonlyFormData.beer + readonlyFormData.juice).toString(),
        timeIn: new Date(readonlyFormData.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        merchandiserId: readonlyFormData.merchandiserId,
      });
      setCheckboxes([true, true, true, true]);
    }
  }, [readonlyFormData, setLoading]);
  
  const submitFormMutation = useMutation({
    mutationFn: async (payload: {
      merchandiserId: string | null;
      outlet: string | null;
      wine: number;
      beer: number;
      juice: number;
      createdAt: string;
    }) => {
      if (isEdit && formId) {
        return axios.put(`http://localhost:5000/user/sosform/${formId}`, payload);
      } else {
        return axios.post("http://localhost:5000/user/sosform", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sosForms"] });
      openSnackbar(
        isEdit ? "Form updated successfully!" : "Form submitted successfully!",
        "success"
      );
      router.push("/pages/merchandiserDashboard");
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      openSnackbar("Failed to submit the form. Please try again.", "error");
    },
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    const readonly = queryParams.get("readonly") === "true";

    setIsReadOnly(readonly);
    setIsEdit(queryParams.get("edit") === "true");
    setFormId(id);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const merchandiserId = user?.id;
    setUserRole(user?.role || null);

    if (!readonly) {
      const data: FormData = {
        wine: queryParams.get("wine"),
        beer: queryParams.get("beer"),
        juice: queryParams.get("juice"),
        outlet: queryParams.get("outlet"),
        total: queryParams.get("total"),
        timeIn: queryParams.get("timeIn"),
        merchandiserId,
      };
      setFormData(data);
    }
  }, [router]);

  const handleCheckboxChange = (index: number) => {
    if (isReadOnly) return;
    const updated = [...checkboxes];
    updated[index] = !updated[index];
    setCheckboxes(updated);
  };

  const allCheckboxesChecked = checkboxes.every((checkbox) => checkbox);

  const handleGoBack = () => {
    const queryParams = new URLSearchParams({
      wine: formData.wine || "",
      beer: formData.beer || "",
      juice: formData.juice || "",
      outlet: formData.outlet || "",
      total: formData.total || "",
      timeIn: formData.timeIn || "",
      fromConforme: "true",
    });
  
    if (isEdit && formId) {
      queryParams.append("edit", "true");
      queryParams.append("id", formId);
    }
  
    router.push(`/pages/createForm?${queryParams.toString()}`);
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        merchandiserId: formData.merchandiserId,
        outlet: formData.outlet,
        wine: Number(formData.wine),
        beer: Number(formData.beer),
        juice: Number(formData.juice),
        createdAt: new Date().toISOString(),
      };

      await submitFormMutation.mutateAsync(payload);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    if (userRole === "ADMIN") {
      router.push("/pages/forms");
    } else {
      router.push("/pages/merchandiserDashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-bold text-[#2F27CE] mb-10">Summary & Conformé</h1>

      <div className="rounded-sm border border-gray-200 shadow-sm bg-white w-full max-w-2xl p-10 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium mb-7">
          <div className="text-center">
            <p className="text-[#2d2d2d] font-semibold mb-2">Actual Time-in</p>
            <p className="text-[#2d2d2d] font-normal">{formData.timeIn}</p>
          </div>
          <div className="text-center">
            <p className="text-[#2d2d2d] font-semibold mb-2">Outlet</p>
            <p className="text-[#2d2d2d] font-normal">{formatOutletName(formData.outlet)}</p>
          </div>
        </div>

        <div className="text-center mt-6 mb-5 space-y-4 text-[#2d2d2d]">
          <p className="font-semibold text-sm">Input Details</p>
          <p className="text-sm">
            Total Beverages -{" "}
            {formData.total && !isNaN(Number(formData.total))
              ? Number(formData.total).toLocaleString()
              : "0"}
          </p>
          <p className="text-sm">
            Wine -{" "}
            {formData.wine && !isNaN(Number(formData.wine))
              ? Number(formData.wine).toLocaleString()
              : "0"}
          </p>
          <p className="text-sm">
            Beer -{" "}
            {formData.beer && !isNaN(Number(formData.beer))
              ? Number(formData.beer).toLocaleString()
              : "0"}
          </p>
          <p className="text-sm">
            Juice -{" "}
            {formData.juice && !isNaN(Number(formData.juice))
              ? Number(formData.juice).toLocaleString()
              : "0"}
          </p>
        </div>

        <hr className="my-4 opacity-20" />

        <div className="space-y-4 text-[12px]">
          {[
            "All information provided in this form is complete, true, and correct to the best of my knowledge",
            "All reimbursement regarding transportation and other valid expenses are accurate",
            "I understand that any false information provided might lead to the disapproval of any related reimbursement and that it may be grounds for demerit, suspension, or even termination of employment",
            "All information provided in this form was reviewed before submission.",
          ].map((text, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1 cursor-pointer"
                checked={checkboxes[idx]}
                disabled={isReadOnly}
                onChange={() => handleCheckboxChange(idx)}
              />
              <label className="text-[#2d2d2d]">{text}</label>
            </div>
          ))}
        </div>

        {!isReadOnly && (
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
              {submitFormMutation.isPending ? "Processing..." : isEdit ? "Update" : "Submit"}
            </Button>
          </div>
        )}

        {isReadOnly && (
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