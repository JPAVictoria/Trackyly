"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { Button } from "@mui/material";
import DateModal from "@/components/frontend/DateModal";
import OutletModal from "@/components/frontend/OutletModal";
import { useModalStore } from "@/app/stores/useModalStore";
import { useLoading } from "@/app/context/loaderContext";
import type { PieValueType } from "@mui/x-charts/models";
import { useEffect, useState } from "react";

interface ProductDistribution {
  outlet: string;
  wine: number;
  beer: number;
  juice: number;
}

interface PieChartDataItem {
  id: string;
  value: number;
  label: string;
  color: string;
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
  const [dateRange, setDateRange] = useState<{
    fromDate: Date | null;
    toDate: Date | null;
  }>({ fromDate: null, toDate: null });

  const {
    data: distribution,
    isError,
    error,
    refetch,
  } = useQuery<ProductDistribution[]>({
    queryKey: ["productDistribution", selectedFilter, dateRange],
    queryFn: async () => {
      setLoading(true);
      try {
        let url = "http://localhost:5000/user/analytics/quarter";
        let params = {};

        if (selectedFilter === "Custom") {
          url = "http://localhost:5000/user/analytics/custom";
          if (dateRange.fromDate && dateRange.toDate) {
            params = {
              fromDate: dateRange.fromDate.toISOString().split("T")[0],
              toDate: dateRange.toDate.toISOString().split("T")[0],
            };
          }
        } else if (selectedFilter.startsWith("Outlet:")) {
          const outletName = selectedFilter.replace("Outlet: ", "");
          url = `http://localhost:5000/user/analytics/outlet?outlet=${encodeURIComponent(
            outletName
          )}`;
        }

        const res = await axios.get(url, { params });
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
  }, [selectedFilter, dateRange, refetch]);

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
  if (fromDate && toDate) {
    const fromUtc = new Date(Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()));
    const toUtc = new Date(Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59));

    setDateRange({ fromDate: fromUtc, toDate: toUtc });
    setSelectedFilter("Custom");
    setIsDateModalOpen(false);
  }
};


  const handleApplyOutletFilter = (outlet: string | null) => {
    if (outlet) {
      setSelectedFilter(`Outlet: ${outlet}`);
    }
    setIsOutletModalOpen(false);
  };

  const getPieChartData = (): PieChartDataItem[] => {
    if (!distribution || distribution.length === 0) return [];

    if (selectedFilter.startsWith("Outlet:")) {
      const data = distribution[0];
      return [
        {
          id: "wine",
          value: data.wine,
          label: "Wine",
          color: "#06b6d4",
          wine: data.wine,
          beer: 0,
          juice: 0,
        },
        {
          id: "beer",
          value: data.beer,
          label: "Beer",
          color: "#a855f7",
          wine: 0,
          beer: data.beer,
          juice: 0,
        },
        {
          id: "juice",
          value: data.juice,
          label: "Juice",
          color: "#14b8a6",
          wine: 0,
          beer: 0,
          juice: data.juice,
        },
      ];
    }

    return distribution.map((outletData, index) => ({
      id: outletData.outlet,
      value: outletData.wine + outletData.beer + outletData.juice,
      label: outletData.outlet,
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

    if (!selectedFilter.startsWith("Outlet:")) {
      return `${labelStr}
Wine: ${data.wine}
Beer: ${data.beer}
Juice: ${data.juice}`;
    }

    return `${labelStr}: ${data.value}`;
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
                if (label === "Default") setSelectedFilter("Default");
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
            <p className="text-red-500">
              Error loading chart data: {error instanceof Error ? error.message : "Unknown error"}
            </p>
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
