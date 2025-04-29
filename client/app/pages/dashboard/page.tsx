"use client";

import NameBlock from "@/components/frontend/NameBlock";
import AnalyticsBlock from "@/components/frontend/AnalyticsBlock";
import StatsOverViewBlock from "@/components/frontend/StatsOverViewBlock";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        <AnalyticsBlock />

        <div className="flex flex-col gap-6">
          <NameBlock />
          <StatsOverViewBlock />
        </div>
      </div>
    </div>
  );
}
