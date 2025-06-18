"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { Button, Skeleton, Box } from "@mui/material";
import DateModal from "@/components/frontend/DateModal";
import OutletModal from "@/components/frontend/OutletModal";
import type { PieValueType } from "@mui/x-charts/models";
import { useState } from "react";
import { buttonStyles } from "@/app/styles/styles";
import { apiUrl } from "@/app/utils/apiUrl";
import moment, { Moment } from "moment";

interface ProductDistribution {
  outlet: string;
  wine: number;
  beer: number;
  juice: number;
}

type FilterType = 'Custom' | 'Outlet' | 'Default';

interface FilterState {
  type: FilterType;
  fromDate: Moment | null;
  toDate: Moment | null;
  outlet: string | null;
}

export default function AnalyticsBlock() {
  const [filter, setFilter] = useState<FilterState>({
    type: 'Default',
    fromDate: null,
    toDate: null,
    outlet: null,
  });

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);

  const { data: distribution, isError, error, refetch, isLoading, isFetching } = useQuery<ProductDistribution[]>({
    queryKey: ["productDistribution", filter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filter.type === "Custom" && filter.fromDate && filter.toDate) {
        params.fromDate = filter.fromDate.format("YYYY-MM-DD");
        params.toDate = filter.toDate.format("YYYY-MM-DD");
      }
      if (filter.type === "Outlet" && filter.outlet) {
        params.outlet = filter.outlet;
      }
      const res = await axios.get(apiUrl("/user/analytics/distribution"), { params });
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const handleFilterClick = (filterType: FilterType) => {
    if (filterType === 'Custom') {
      setIsDateModalOpen(true);
    } else if (filterType === 'Outlet') {
      setIsOutletModalOpen(true);
    } else {
      
      setFilter({
        type: 'Default',
        fromDate: null,
        toDate: null,
        outlet: null,
      });
    }
  };

  const handleApplyCustomFilter = (fromDate: Moment | null, toDate: Moment | null) => {
    if (fromDate && toDate) {
      setFilter({
        type: "Custom",
        fromDate: fromDate.clone().startOf("day"),
        toDate: toDate.clone().endOf("day"),
        outlet: null,
      });
      setIsDateModalOpen(false);
    }
  };

  const handleApplyOutletFilter = (outlet: string | null) => {
    if (outlet) {
      setFilter({
        type: 'Outlet',
        fromDate: null,
        toDate: null,
        outlet,
      });
    }
    setIsOutletModalOpen(false);
  };

  const getPieChartData = () => {
    if (!distribution?.length) return [];

    const colors = ["#06b6d4", "#a855f7", "#14b8a6"];

    return distribution.map((outletData, index) => ({
      id: outletData.outlet,
      value: outletData.wine + outletData.beer + outletData.juice,
      label: outletData.outlet,
      color: colors[index % 3],
      wine: outletData.wine,
      beer: outletData.beer,
      juice: outletData.juice,
    }));
  };

  const valueFormatter = (slice: PieValueType) => {
    const data = getPieChartData().find((d) => d.label === slice.label);
    if (!data) return `${slice.value}`;

    if (filter.type === "Outlet") {
      return `${slice.label}: ${slice.value}`;
    }
    return `${slice.label}\nWine: ${data.wine}\nBeer: ${data.beer}\nJuice: ${data.juice}`;
  };

  const getNoDataMessage = () => {
    if (filter.type === "Custom" && filter.fromDate && filter.toDate) {
      return `for ${filter.fromDate.format("MMM DD")} - ${filter.toDate.format("MMM DD, YYYY")}`;
    }
    if (filter.type === "Outlet" && filter.outlet) {
      return `for ${filter.outlet}`;
    }
    return `for Q${moment().quarter()} ${moment().year()}`;
  };

  const getSelectedFilterLabel = () => {
    if (filter.type === 'Custom') return 'Custom';
    if (filter.type === 'Outlet') return 'Outlet';
    return 'Default';
  };

  const isLoadingData = isLoading || isFetching;

  return (
    <div className="bg-white shadow-md rounded-sm p-6 max-w-md w-full">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-[#433BFF] text-center mb-6">
          Product Distribution by Outlet
        </h2>

        <div className="flex justify-center gap-2 mb-6">
          {(['Custom', 'Outlet', 'Default'] as FilterType[]).map((label) => (
            <Button
              key={label}
              variant="outlined"
              size="small"
              disabled={isLoadingData}
              onClick={() => handleFilterClick(label)}
              sx={{
                ...buttonStyles,
                borderColor: getSelectedFilterLabel() === label ? "#433BFF" : buttonStyles.borderColor,
                color: getSelectedFilterLabel() === label ? "#433BFF" : buttonStyles.color,
                opacity: isLoadingData ? 0.6 : 1,
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex-1 flex justify-center items-center min-h-[250px]">
          {isLoadingData ? (
            <Box className="flex flex-col items-center gap-4">
              <Skeleton
                variant="circular"
                width={200}
                height={200}
                sx={{ 
                  bgcolor: 'rgba(67, 59, 255, 0.1)',
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, rgba(67, 59, 255, 0.2), transparent)'
                  }
                }}
              />
            </Box>
          ) : isError ? (
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading chart data</p>
              <p className="text-sm text-gray-600 mb-2">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <Button
                variant="outlined"
                size="small"
                onClick={() => refetch()}
                sx={buttonStyles}
              >
                Retry
              </Button>
            </div>
          ) : !distribution?.length ? (
            <div className="text-center">
              <p className="text-gray-600 mb-2">No data available</p>
              <p className="text-sm text-gray-500">{getNoDataMessage()}</p>
            </div>
          ) : (
            <PieChart
              series={[{
                data: getPieChartData(),
                highlightScope: { fade: "global", highlight: "item" },
                faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                valueFormatter,
              }]}
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
        initialFromDate={filter.fromDate}
        initialToDate={filter.toDate}
      />

      <OutletModal
        open={isOutletModalOpen}
        onClose={() => setIsOutletModalOpen(false)}
        onSelectOutlet={handleApplyOutletFilter}
        selectedOutlet={filter.outlet}
      />
    </div>
  );
}