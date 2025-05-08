"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import DateModal from "@/components/frontend/DateModal";
import OutletModal from "@/components/frontend/OutletModal";
import { useModalStore } from "@/app/stores/useModalStore";

interface ProductDistribution {
  outlet: string;
  wine: number;
  beer: number;
  juice: number;
}

export default function AnalyticsBlock() {
  const {
    selectedFilter,
    isDateModalOpen,
    isOutletModalOpen,
    setSelectedFilter,
    setIsDateModalOpen,
    setIsOutletModalOpen,
    handleFilterClick,
  } = useModalStore();

  const {
    data: distribution,
    isLoading,
    isError,
  } = useQuery<ProductDistribution[]>({
    queryKey: ["quarterlyProductDistribution"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/user/analytics/quarter");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, 
  });

  const filterButtons = ["Custom", "Outlet", "Default"];

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

  const handleApplyCustomFilter = (fromDate: Date | null, toDate: Date | null) => {
    console.log("Applying custom filter with dates:", { fromDate, toDate });
    setSelectedFilter("Custom");
    setIsDateModalOpen(false);
  };

  const handleApplyOutletFilter = (outlet: string | null) => {
    if (outlet) {
      console.log("Selected outlet:", outlet);
      setSelectedFilter(`Outlet: ${outlet}`);
    }
    setIsOutletModalOpen(false);
  };

  // Generate Pie Chart data based on distribution for each outlet
  const getPieChartData = () => {
    if (!distribution || distribution.length === 0) return [];

    return distribution.map((outletData, index) => ({
      id: outletData.outlet,
      value: outletData.wine + outletData.beer + outletData.juice, // Total quantity for this outlet
      color: ["#06b6d4", "#a855f7", "#14b8a6"][index % 3], // Use different colors for different outlets
      outletName: outletData.outlet,
      wine: outletData.wine,
      beer: outletData.beer,
      juice: outletData.juice,
    }));
  };

  // Format the tooltip information to display vertically
  const valueFormatter = (value: { value: number }) => {
    return `${value.value}`; // Show quantity instead of percentage
  };

  return (
    <div className="bg-white shadow-md rounded-sm p-6 max-w-md w-full">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-[#433BFF] text-center mb-6">
          Product Distribution by Outlet
        </h2>

        <div className="flex justify-center gap-2 mb-6">
          {filterButtons.map((label) => (
            <Button
              key={label}
              variant="outlined"
              size="small"
              onClick={() => handleFilterClick(label as "Custom" | "Outlet" | "Default")}
              sx={{
                ...buttonStyles,
                borderColor: selectedFilter.startsWith(label) ? "#433BFF" : buttonStyles.borderColor,
                color: selectedFilter.startsWith(label) ? "#433BFF" : buttonStyles.color,
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex-1 flex justify-center items-center min-h-[250px]">
          {isLoading ? (
            <CircularProgress />
          ) : isError ? (
            <p className="text-red-500">Error loading chart data.</p>
          ) : !distribution || distribution.length === 0 ? (
            <p>No data available for this period.</p>
          ) : (
            <div className="relative">
              <PieChart
                series={[
                  {
                    data: getPieChartData(),
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                    valueFormatter,
                  },
                ]}
                height={250}
              />
              {/* Tooltip Overlay Logic */}
              {getPieChartData().map((outletData) => (
                <Tooltip
                  key={outletData.id}
                  title={
                    <div className="flex flex-col">
                      <strong>{outletData.outletName}</strong>
                      <span>Wine: {outletData.wine}</span>
                      <span>Beer: {outletData.beer}</span>
                      <span>Juice: {outletData.juice}</span>
                    </div>
                  }
                  arrow
                  placement="top"
                >
                  <div
                    className="absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          )}
        </div>
      </div>

      <DateModal
        open={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleApplyCustomFilter}
      />

      <OutletModal
        open={isOutletModalOpen}
        onClose={() => setIsOutletModalOpen(false)}
        onSelectOutlet={handleApplyOutletFilter}
        selectedOutlet={
          selectedFilter.startsWith("Outlet:") ? selectedFilter.replace("Outlet: ", "") : null
        }
      />
    </div>
  );
}
