"use client";

import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/app/stores/authStore";

export default function Register() {
  const {
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
  } = useAuthStore((state) => state.register);

  const firstName = "";
  const lastName = "";
  const email = "";
  const password = "";
  const confirmPassword = "";

  const fields = [
    { id: "firstName", label: "First Name", value: firstName, type: "text" },
    { id: "lastName", label: "Last Name", value: lastName, type: "text" },
    { id: "email", label: "Email", value: email, type: "email" },
    {
      id: "password",
      label: "Password",
      value: password,
      type: showPassword ? "text" : "password",
      isPassword: true,
      toggle: toggleShowPassword,
      show: showPassword,
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      value: confirmPassword,
      type: showConfirmPassword ? "text" : "password",
      isPassword: true,
      toggle: toggleShowConfirmPassword,
      show: showConfirmPassword,
    },
  ];

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

      <h1 className="text-[18px] mb-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
        Trackyly
      </h1>

      <div className="grid w-full max-w-sm items-center text-center mb-10">
        <h1 className="mt-10 font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
          Register Now
        </h1>

        <form className="pt-5 space-y-5">
          {fields.map((field) => (
            <div key={field.id} className="relative">
              <Label htmlFor={field.id} className="pb-2 text-[#2d2d2d]">
                {field.label}
              </Label>
              <Input
                type={field.type}
                id={field.id}
                placeholder={field.label}
                className="w-full focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300 pr-10"
              />
              {field.isPassword && (
                <div
                  onClick={field.toggle}
                  className="absolute inset-y-10 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#2F27CE] transition"
                >
                  {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full text-white py-5 px-4 rounded-md transition duration-200 bg-[#2F27CE] hover:bg-[#433BFF] cursor-pointer"
          >
            Register
          </Button>

          <div className="pt-8">
            <p className="font-light text-sm text-[#2d2d2d]">
              Already have an account?
            </p>
            <Link href="/pages/login">
              <Button
                variant="link"
                className="cursor-pointer pt-3 text-[#2d2d2d]"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
