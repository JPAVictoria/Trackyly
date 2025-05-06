"use client";

// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
// import { Button } from "@mui/material";

export default function Unauthorized() {
  // const router = useRouter();

  // const handleLoginRedirect = () => {
  //   Cookies.remove("token");
  //   localStorage.removeItem("user");
  //   router.push("/pages/login");
  // };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <DotPattern
          glow={true}
          className={cn(
            "h-full w-full",
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
      </div>

      <div className="flex flex-col items-center text-center space-y-4 z-10">
        <h1 className="font-bold text-4xl leading-[1.5] text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
          Unauthorized
        </h1>
        <p className="text-[#2d2d2d] tracking-wide text-md font-medium opacity-85">
          You are not authorized to access this page. <br/> Please contact your
          administrator for access.
        </p>
      </div>
    </div>
  );
}
