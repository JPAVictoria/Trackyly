"use client";

import { useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useStatisticStore } from "@/app/stores/useStatisticStore";
import Link from "next/link";
import { buttonStyles} from "@/app/styles/styles"; 

export default function StatsOverViewBlock() {
  const {
    sosCount,
    merchCount,
    loading,
    error,
    setSosCount,
    setMerchCount,
    setLoading,
    setError,
  } = useStatisticStore();

  useEffect(() => {
    async function fetchStatistics() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://trackyly.onrender.com/user/statistics",
          {
            withCredentials: true,
          }
        );

        setSosCount(response.data.sosCount);
        setMerchCount(response.data.merchCount);
      } catch (error) {
        console.log(error);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    }

    fetchStatistics();
  }, [setSosCount, setMerchCount, setLoading, setError]);


  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-sm h-64 p-4 w-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-sm h-64 p-4 w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-sm h-64 p-4 w-full flex items-center">
      <div className="w-1/2 flex flex-col items-center justify-center text-center">
        <p className="text-md font-semibold text-[#433BFF]">
          All SOS <br /> Overview
        </p>
        <p className="text-lg font-bold text-gray-800 mt-4">{sosCount}</p>
        <div className="mt-4">
          <Button
            sx={buttonStyles}
            variant="outlined"
            onClick={() => (window.location.href = "/pages/forms")}
          >
            View All
          </Button>
        </div>
      </div>

      <div className="w-px h-3/4 bg-gray-500/50 mx-4" />

      <div className="w-1/2 flex flex-col items-center justify-center text-center">
        <p className="text-md font-semibold text-[#433BFF]">
          Onboarded Merchandisers
        </p>
        <p className="text-lg font-bold text-gray-800 mt-4">{merchCount}</p>
        <div className="mt-4">
          <Link href="/pages/userRoles">
            <Button sx={buttonStyles} variant="outlined">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
