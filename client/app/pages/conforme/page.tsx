"use client";

import { useState } from "react";
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

export default function Conforme() {
    useRoleGuard(["MERCHANDISER"]);
  
  const [checkboxes, setCheckboxes] = useState([false, false, false, false]);

  const handleCheckboxChange = (index: number) => {
    const updated = [...checkboxes];
    updated[index] = !updated[index];
    setCheckboxes(updated);
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-bold text-[#2F27CE] mb-10">
        Summary & Conformé
      </h1>

      <div className="rounded-sm border border-gray-200 shadow-sm bg-white w-full max-w-2xl p-10 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium mb-7">
          <div className="text-center">
            <p className="text-[#2d2d2d] font-semibold mb-2">Actual Time-in</p>
            <p className="text-[#2d2d2d] font-normal">10-29-2004 19:24:24 PM</p>
          </div>
          <div className="text-center">
            <p className="text-[#2d2d2d] font-semibold mb-2">Outlet</p>
            <p className="text-[#2d2d2d] font-normal">SA BAHAY NI ALING NENA</p>
          </div>
        </div>

        <div className="text-center mt-6 mb-5 space-y-4 text-[#2d2d2d]">
          <p className="font-semibold text-sm">Input Details</p>
          <p className="text-sm">Total Beverages - 10</p>
          <p className="text-sm">Wine - 30</p>
          <p className="text-sm">Beer - 50</p>
          <p className="text-sm">Juice - 20</p>
        </div>

        <hr className="my-4 opacity-20" />


        <div className="space-y-4 text-[12px]">
          {[
            "All information provided in this form is complete, true, and correct to the best of my knowledge",
            "All reimbursement regarding transportation and other valid expenses are accurate",
            "I understand that any false information provided might lead to the disapproval of any related reimbursement and that it may be grounds for demerit, suspension, or even termination of employment and that",
            "All information provided in this form was reviewed before submission.",
          ].map((text, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1 cursor-pointer"
                checked={checkboxes[idx]}
                onChange={() => handleCheckboxChange(idx)}
              />
              <label className="text-[#2d2d2d]">{text}</label>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6">
          <Button sx={buttonStyles} variant="outlined">
            ← Go back
          </Button>
          <Button sx={buttonStyles} variant="outlined">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
