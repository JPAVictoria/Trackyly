"use client";

import { useEffect } from "react";
import NameBlock from "@/components/frontend/NameBlock";
import AnalyticsBlock from "@/components/frontend/AnalyticsBlock";
import StatsOverViewBlock from "@/components/frontend/StatsOverViewBlock";
import Navbar from "@/components/frontend/Navbar";
import { useLoading } from "@/app/context/loaderContext";

export default function Dashboard() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      <div className="flex flex-col items-center -mt-20">
        <h1 className="text-[24px] font-bold text-[#2F27CE] text-center mb-20">
          Share of Shelf Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl w-full">
          <div className="md:col-span-2 flex justify-center">
            <AnalyticsBlock />
          </div>
          <div className="flex flex-col gap-4">
            <NameBlock />
            <StatsOverViewBlock />
          </div>
        </div>
      </div>

      <div>
        <Navbar />
      </div>
    </div>
  );
}