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
import moment from "moment";

interface ProductDistribution {
  outlet: string;
  wine: number;
  beer: number;
  juice: number;
}

type FilterType = 'Custom' | 'Outlet' | 'Default';

export default function AnalyticsBlock() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType | string>('Default');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    fromDate: Date | null;
    toDate: Date | null;
  }>({ fromDate: null, toDate: null });

  const { data: distribution, isError, error, refetch, isLoading, isFetching } = useQuery<ProductDistribution[]>({
    queryKey: ["productDistribution", selectedFilter, dateRange],
    queryFn: async () => {
      const isOutletFilter = selectedFilter.startsWith("Outlet:");
      const url = isOutletFilter 
        ? apiUrl(`/user/analytics/outlet?outlet=${encodeURIComponent(selectedFilter.replace("Outlet: ", ""))}`)
        : apiUrl("/user/analytics/summary");
      
      const params = selectedFilter === "Custom" && dateRange.fromDate && dateRange.toDate 
        ? {
            fromDate: moment(dateRange.fromDate).format('YYYY-MM-DD'),
            toDate: moment(dateRange.toDate).format('YYYY-MM-DD'),
          }
        : {};

      const res = await axios.get(url, { params });
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const handleFilterClick = (label: FilterType) => {
    if (label === 'Custom') setIsDateModalOpen(true);
    else if (label === 'Outlet') setIsOutletModalOpen(true);
    else setSelectedFilter(label);
  };

  const handleApplyCustomFilter = (fromDate: Date | null, toDate: Date | null) => {
    if (fromDate && toDate) {
      setDateRange({ 
        fromDate: moment(fromDate).utc().startOf('day').toDate(),
        toDate: moment(toDate).utc().endOf('day').toDate()
      });
      setSelectedFilter("Custom");
      setIsDateModalOpen(false);
    }
  };

  const handleApplyOutletFilter = (outlet: string | null) => {
    if (outlet) setSelectedFilter(`Outlet: ${outlet}`);
    setIsOutletModalOpen(false);
  };

  const getPieChartData = () => {
    if (!distribution?.length) return [];

    const colors = ["#06b6d4", "#a855f7", "#14b8a6"];
    
    if (selectedFilter.startsWith("Outlet:")) {
      const data = distribution[0];
      return ['wine', 'beer', 'juice'].map((product, index) => ({
        id: product,
        value: data[product as keyof ProductDistribution] as number,
        label: product.charAt(0).toUpperCase() + product.slice(1),
        color: colors[index],
        wine: product === 'wine' ? data.wine : 0,
        beer: product === 'beer' ? data.beer : 0,
        juice: product === 'juice' ? data.juice : 0,
      }));
    }

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
    const data = getPieChartData().find(d => d.label === slice.label);
    if (!data) return `${slice.value}`;

    return selectedFilter.startsWith("Outlet:")
      ? `${slice.label}: ${data.value}`
      : `${slice.label}\nWine: ${data.wine}\nBeer: ${data.beer}\nJuice: ${data.juice}`;
  };

  const getNoDataMessage = () => {
    if (selectedFilter === 'Custom' && dateRange.fromDate && dateRange.toDate) {
      return `for ${moment(dateRange.fromDate).format('MMM DD')} - ${moment(dateRange.toDate).format('MMM DD, YYYY')}`;
    }
    if (selectedFilter.startsWith('Outlet:')) {
      return `for ${selectedFilter.replace('Outlet: ', '')}`;
    }
    return `for Q${moment().quarter()} ${moment().year()}`;
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
              onClick={() => {
                if (label === "Default") {
                  setSelectedFilter("Default");
                  setDateRange({ fromDate: null, toDate: null });
                } else {
                  handleFilterClick(label);
                }
              }}
              sx={{
                ...buttonStyles,
                borderColor: selectedFilter.startsWith(label) ? "#433BFF" : buttonStyles.borderColor,
                color: selectedFilter.startsWith(label) ? "#433BFF" : buttonStyles.color,
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
        initialFromDate={dateRange.fromDate}
        initialToDate={dateRange.toDate}
      />

      <OutletModal
        open={isOutletModalOpen}
        onClose={() => setIsOutletModalOpen(false)}
        onSelectOutlet={handleApplyOutletFilter}
        selectedOutlet={selectedFilter.startsWith("Outlet:") ? selectedFilter.replace("Outlet: ", "") : null}
      />
    </div>
  );
}