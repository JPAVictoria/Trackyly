"use client";
import { useEffect } from "react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useLoading } from "@/app/context/loaderContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { loading: globalLoading, setLoading } = useLoading();

  const {
    login: {
      email,
      password,
      loading: formLoading,
      showPassword,
      setEmail,
      setPassword,
      toggleShowPassword,
      resetForm,
      setLoading: setLoginLoading,
    },
  } = useAuthStore();

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      openSnackbar("Email and password are required.", "error");
      return;
    }


    try {
      const response = await axios.post("http://localhost:5000/user/login/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Login failed, invalid response.");
      }

      Cookies.set("token", token, { expires: 1 });
      localStorage.setItem("user", JSON.stringify(user));
      openSnackbar("Login successful!", "success");

      if (user.role === "ADMIN") {
        router.push("/pages/adminDashboard");
      } else if (user.role === "MERCHANDISER") {
        router.push("/pages/merchandiserDashboard");
      } else {
        openSnackbar("Unknown role. Contact support.", "error");
        Cookies.remove("token");
        localStorage.removeItem("user");
      }

      setLoading(true);
      setLoginLoading(true);
      
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
    
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      openSnackbar(errorMessage, "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const isLoading = globalLoading || formLoading;

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

        <form onSubmit={handleLogin} className="pt-5">
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
              disabled={isLoading}
              className="focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300"
            />
          </div>

          <div className="pt-5 relative">
            <Label htmlFor="password" className="pb-2 text-[#2d2d2d]">
              Password
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300 pr-10"
            />
            <div
              onClick={toggleShowPassword}
              className="absolute inset-y-15 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#2F27CE] transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/pages/forgot-password">
                <Button
                  variant="link"
                  className="text-[#2d2d2d] text-xs p-0 h-auto cursor-pointer font-medium"
                  disabled={isLoading}
                >
                  Forgot Password?
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-5">
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-5 px-4 rounded-md transition duration-200 ${
                isLoading
                  ? "bg-[#A5A8F0] cursor-not-allowed"
                  : "bg-[#2F27CE] hover:bg-[#433BFF] cursor-pointer"
              }`}
            >
              {isLoading ? "Processing..." : "Login"}
            </Button>
          </div>

          <div className="pt-8">
            <p className="font-light text-sm text-[#2d2d2d]">
              Don&apos;t have an account yet?
            </p>
            <Link href="/pages/register">
              <Button
                variant="link"
                className="cursor-pointer pt-3 text-[#2d2d2d]"
                disabled={isLoading}
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