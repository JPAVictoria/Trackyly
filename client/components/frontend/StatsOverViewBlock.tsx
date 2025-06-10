"use client";
import { useEffect, useState } from "react";
import { Button, Skeleton } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { buttonStyles } from "@/app/styles/styles";
import { apiUrl } from "@/app/utils/apiUrl";
import { useRouter } from "next/navigation";

export default function StatsOverViewBlock() {
  const [sosCount, setSosCount] = useState(0);
  const [merchCount, setMerchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchStatistics() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(apiUrl("/user/statistics"), {
          withCredentials: true,
        });

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
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-sm h-64 p-4 w-full flex items-center">
        <div className="w-1/2 flex flex-col items-center justify-center text-center">
          <Skeleton variant="text" width={110} height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width={60} height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width={100} height={36} />
        </div>

        <div className="w-px h-3/4 bg-gray-500/50 mx-4" />

        <div className="w-1/2 flex flex-col items-center justify-center text-center">
          <Skeleton variant="text" width={110} height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width={60} height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width={100} height={36} />
        </div>
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
            onClick={() => router.push("/pages/forms")}
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
