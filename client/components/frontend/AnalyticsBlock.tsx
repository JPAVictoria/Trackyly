"use client";

import { useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Button } from "@mui/material";

export default function Analytics() {
  const [selectedFilter, setSelectedFilter] = useState("Custom");

  const pieChartData = [
    { id: 0, value: 30, color: "#06b6d4" },
    { id: 1, value: 40, color: "#a855f7" },
    { id: 2, value: 30, color: "#14b8a6" },
  ];

  const filterButtons = ["Custom", "Monthly", "All time"];

  const buttonStyles = {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "rgba(45, 45, 45, 0.1)",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "rgba(45, 45, 45, 0.2)",
    },
  };

  const valueFormatter = (value: { value: number }) => {
    return `${value.value}%`;
  };

  return (
    <div className="bg-white shadow-md rounded-sm p-6 max-w-md w-full">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-[#433BFF] text-center mb-6">
          Product Distribution
        </h2>

        <div className="flex justify-center gap-2 mb-6">
          {filterButtons.map((label) => (
            <Button
              key={label}
              variant="outlined"
              size="small"
              onClick={() => setSelectedFilter(label)}
              sx={{
                ...buttonStyles,
                borderColor: selectedFilter === label ? "#433BFF" : buttonStyles.borderColor,
                color: selectedFilter === label ? "#433BFF" : buttonStyles.color,
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex-1 flex justify-center items-center">
          <PieChart
            series={[{
              data: pieChartData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              valueFormatter,
            }]}
            height={250}
          />
        </div>
      </div>
    </div>
  );
}
