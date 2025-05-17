"use client";

import { useState } from "react";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";

export default function ForgotPassword() {
  const { openSnackbar } = useSnackbar();
  
  const { loading, setLoading, setSubmitted} = useAuthStore((state) => state.forgotPassword);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      openSnackbar("Please enter an email address", "error");
      return;
    }

    setLoading(true);
    setSubmitted(false);

    try {
      const res = await axios.post("http://localhost:5000/user/forgot/forgot", { email });

      if (res.status === 200 || res.status === 201) {
        openSnackbar(res.data.message, "success");
        setSubmitted(true);
      } else {
        openSnackbar(res.data.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);

      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.message ||
          "Server responded with an unknown error.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      openSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={5}
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
          Forgot your password?
        </h1>

        <form onSubmit={handleSubmit} className="pt-5">
          <div>
            <Label htmlFor="email" className="pb-2 text-[#2d2d2d]">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300"
            />
          </div>

          <div className="pt-5">
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white py-5 px-4 rounded-md transition duration-200 bg-[#2F27CE] hover:bg-[#433BFF] cursor-pointer"
            >
              {loading ? "Sending..." : "Submit"}
            </Button>
          </div>
        </form>

        <div className="pt-8">
          <p className="font-light text-sm text-[#2d2d2d]">Remember your password?</p>
          <Link href="/pages/login">
            <Button variant="link" className="cursor-pointer pt-3 text-[#2d2d2d]">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
