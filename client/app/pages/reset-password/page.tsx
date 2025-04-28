"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/app/stores/useAuthStore"; 
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function ChangePassword() {
  const {
    changePassword: {
      showNew,
      showConfirm,
      toggleShowNew,
      toggleShowConfirm,
    },
  } = useAuthStore(); 



  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={5}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "absolute inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />

<h1 className="text-[18px] mb-30 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
        Trackyly
      </h1>


      <div className="grid w-full max-w-sm items-center text-center mb-20">
        <h1 className="font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
          Change your password
        </h1>

        <form className="pt-5">
          <div className="relative">
            <Label htmlFor="new-password" className="pb-2 text-[#2d2d2d]">
              New Password
            </Label>
            <Input
              type={showNew ? "text" : "password"} 
              id="new-password"
              placeholder="********"
              className="pr-10 focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300"
            />
            <div
              onClick={toggleShowNew} 
              className="absolute top-10 right-3 -translate-y-1/2 flex items-center cursor-pointer text-gray-500 hover:text-[#2F27CE] transition"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="relative pt-5">
            <Label htmlFor="confirm-password" className="pb-2 text-[#2d2d2d]">
              Confirm New Password
            </Label>
            <Input
              type={showConfirm ? "text" : "password"} 
              id="confirm-password"
              placeholder="********"
              className="pr-10 focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300"
            />
            <div
              onClick={toggleShowConfirm} 
              className="absolute top-15 right-3 -translate-y-1/2 flex items-center cursor-pointer text-gray-500 hover:text-[#2F27CE] transition"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="pt-5">
            <Button
              type="submit"
              className="w-full text-white py-5 px-4 rounded-md transition duration-200 bg-[#2F27CE] hover:bg-[#433BFF] cursor-pointer"
            >
              Submit
            </Button>
          </div>
        </form>

        <div className="pt-5">
          <Link href="/pages/login">
            <Button variant="link" className="cursor-pointer pt-3 text-[#2d2d2d]">
              Go back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
