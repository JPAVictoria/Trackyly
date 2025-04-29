"use client";

import { Button } from "@/components/ui/button";

export default function StatsOverviewCard() {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full flex justify-between">
      <div className="text-center w-1/2 border-r">
        <p className="text-sm font-semibold text-indigo-600">
          All SOS <br /> Overview
        </p>
        <p className="text-lg font-bold text-gray-800 mt-1">25</p>
        <Button className="mt-2 text-sm" variant="outline">
          View All
        </Button>
      </div>
      <div className="text-center w-1/2">
        <p className="text-sm font-semibold text-indigo-600">Onboarded Merchandisers</p>
        <p className="text-lg font-bold text-gray-800 mt-1">25</p>
        <Button className="mt-2 text-sm" variant="outline">
          View All
        </Button>
      </div>
    </div>
  );
}
