"use client";

import { useEffect } from "react";
import NameBlock from "@/components/frontend/NameBlock";
import AnalyticsBlock from "@/components/frontend/AnalyticsBlock";
import StatsOverViewBlock from "@/components/frontend/StatsOverViewBlock";
import Navbar from "@/components/frontend/Navbar";
import { useLoading } from "@/app/context/loaderContext";
import useRoleGuard from "@/app/hooks/useRoleGuard";

export default function Dashboard() {
  const { setLoading } = useLoading();
  useRoleGuard(["ADMIN"]);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      <div className="flex flex-col items-center  md:-mt-20 mt-8">
        <h1 className="text-[24px] font-bold text-[#2F27CE] text-center mb-8 md:mb-20">
          Share of Shelf Dashboard
        </h1>
        
        {/* Layout for desktop (768px and above) */}
        <div className="hidden md:grid grid-cols-3 max-w-4xl w-full">
          <div className="col-span-2 flex justify-center">
            <AnalyticsBlock />
          </div>
          <div className="flex flex-col gap-4">
            <NameBlock />
            <StatsOverViewBlock />
          </div>
        </div>

        <div className="flex md:hidden flex-col gap-4 w-full max-w-4xl">
          <NameBlock />
          <StatsOverViewBlock />
          <AnalyticsBlock />
        </div>
      </div>

      <div>
        <Navbar />
      </div>
    </div>
  );
}