"use client";

import { Button } from "@mui/material";

export default function StatsOverviewCard() {
  const buttonStyles = {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "rgba(45, 45, 45, 0.1)",
    textTransform: "none",
    fontSize: "0.75rem",
    padding: "4px 10px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "rgba(45, 45, 45, 0.2)",
    },
  };

  return (
    <div className="bg-white shadow-md rounded-sm h-64 p-4 w-full flex items-center">
      <div className="w-1/2 flex flex-col items-center justify-center text-center">
        <p className="text-md font-semibold text-[#433BFF] ">
          All SOS <br /> Overview
        </p>
        <p className="text-lg font-bold text-gray-800 mt-4">25</p>
        <div className="mt-4">
          <Button sx={buttonStyles} variant="outlined">
            View All
          </Button>
        </div>
      </div>

      <div className="w-px h-3/4 bg-gray-500/50 mx-4" />

      <div className="w-1/2 flex flex-col items-center justify-center text-center">
        <p className="text-md font-semibold text-[#433BFF] ">
          Onboarded Merchandisers
        </p>
        <p className="text-lg font-bold text-gray-800 mt-4">25</p>
        <div className="mt-4">
          <Button sx={buttonStyles} variant="outlined">
            View All
          </Button>
        </div>
      </div>
    </div>
  );
}
