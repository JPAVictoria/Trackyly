"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { Button } from "@mui/material";
import DateModal from "@/components/frontend/DateModal";
import OutletModal from "@/components/frontend/OutletModal";
import { useModalStore } from "@/app/stores/useModalStore";
import { useLoading } from "@/app/context/loaderContext";
import type { PieValueType } from '@mui/x-charts/models';
import { useEffect } from "react";

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

  const { setLoading } = useLoading(); 

  const {
    data: distribution,
    isError,
    refetch,
  } = useQuery<ProductDistribution[]>({
    queryKey: ["quarterlyProductDistribution", selectedFilter],
    queryFn: async () => {
      setLoading(true);
      try {
        let url = "http://localhost:5000/user/analytics/quarter";
  
        if (selectedFilter === "Custom") {
          url = "http://localhost:5000/user/analytics/custom";
        } else if (selectedFilter.startsWith("Outlet:")) {
          url = `http://localhost:5000/user/analytics/outlet?outlet=${selectedFilter.replace("Outlet: ", "")}`;
        }
  
        const res = await axios.get(url);
        return res.data;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 0, 
    refetchOnMount: true, 
  });

  useEffect(() => {
    refetch();
  }, [selectedFilter, refetch]);

  const filterButtons = ["Custom", "Outlet", "Default"];

  const buttonStyles = {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "rgba(45, 45, 45, 0.1)",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "rgba(45, 45, 0.2)",
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

  interface PieChartDataItem {
    id: string;
    value: number;
    label: string;
    color: string;
    wine: number;
    beer: number;
    juice: number;
  }

  const getPieChartData = (): PieChartDataItem[] => {
    if (!distribution || distribution.length === 0) return [];
    return distribution.map((outletData, index) => ({
      id: outletData.outlet,
      value: outletData.wine + outletData.beer + outletData.juice,
      label: String(outletData.outlet),
      color: ["#06b6d4", "#a855f7", "#14b8a6"][index % 3],
      wine: outletData.wine,
      beer: outletData.beer,
      juice: outletData.juice,
    }));
  };

  const valueFormatter = (slice: PieValueType) => {
    const labelStr = typeof slice.label === "string" ? slice.label : undefined;
    if (!labelStr) return `${slice.value}`;
  
    const data = getPieChartData().find((d) => d.label === labelStr);
  
    if (!data) return `${labelStr}: ${slice.value}`;
  
    return `Wine - ${data.wine}\nBeer - ${data.beer}\nJuice - ${data.juice}`;
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
              onClick={() => {
                handleFilterClick(label as "Custom" | "Outlet" | "Default");
                if (label === "Default") {
                  setSelectedFilter("Default");
                }
              }}
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
          {isError ? (
            <p className="text-red-500">Error loading chart data.</p>
          ) : !distribution || distribution.length === 0 ? (
            <p>No data available for this period.</p>
          ) : (
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
              hideLegend={true}
            />
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