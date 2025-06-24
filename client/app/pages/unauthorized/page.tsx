"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function Unauthorized() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    useAuthStore.getState().clearRole();
    router.push("/pages/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 sm:px-6">
      <div className="absolute inset-0">
        <DotPattern
          glow={true}
          className={cn(
            "h-full w-full",
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] max-[368px]:[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]"
          )}
        />
      </div>

      <div className="flex flex-col items-center text-center space-y-3 max-[368px]:space-y-2 z-10 max-w-sm max-[368px]:max-w-xs w-full">
        <h1 className="font-bold text-4xl max-[368px]:text-3xl leading-[1.5] max-[368px]:leading-[1.4] text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
          Unauthorized
        </h1>
        <p className="text-[#2d2d2d] tracking-wide text-md max-[368px]:text-sm font-normal max-[368px]:leading-relaxed">
          You are not authorized to access this page. <br className="max-[368px]:hidden" />
          <span className="max-[368px]:inline hidden"> </span>
          Please contact your administrator for access.
        </p>

        <button
          onClick={handleLoginRedirect}
          className="mt-2 max-[368px]:mt-1 text-sm max-[368px]:text-xs px-4 max-[368px]:px-3 py-1.5 max-[368px]:py-1 border-2 border-[#2d2d2d59] rounded-md text-[#2d2d2d] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}