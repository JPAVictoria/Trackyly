import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react";

export default function Home() {
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
      Welcome back
    </h1>

    <form className="pt-5">
      <div>
        <Label htmlFor="email" className="pb-2 text-[#2d2d2d]">
          Email
        </Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          className="focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300"
        />
      </div>

      <div className="pt-5 relative">
        <Label htmlFor="password" className="pb-2 text-[#2d2d2d]">
          Password
        </Label>
        <Input
          type="password"
          id="password"
          placeholder="********"
          className="w-full focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300 pr-10"
        />
        <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#2F27CE] transition">
        </div>

        <div className="flex justify-end pt-1">
          <Link href="/viewer/forgot-password">
            <Button
              variant="link"
              className="text-[#2d2d2d] text-xs p-0 h-auto cursor-pointer font-medium"
            >
              Forgot Password?
            </Button>
          </Link>
        </div>
      </div>

      <div className="pt-5">
        <Button
          type="submit"
          className="w-full text-white py-5 px-4 rounded-md transition duration-200 bg-[#2F27CE] hover:bg-[#433BFF] cursor-pointer"
        >
          Login
        </Button>
      </div>

      <div className="pt-8">
        <p className="font-light text-sm text-[#2d2d2d]">
          Don't have an account yet?
        </p>
        <Link href="/auth/register">
          <Button
            variant="link"
            className="cursor-pointer pt-3 text-[#2d2d2d]"
          >
            Get Started here
          </Button>
        </Link>
      </div>
    </form>
  </div>
</div>

  );
}
