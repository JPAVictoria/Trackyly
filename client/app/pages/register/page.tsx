"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { Eye, EyeOff } from "lucide-react";
import { useLoading } from "@/app/context/loaderContext";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/app/utils/apiUrl";

export default function Register() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { setLoading } = useLoading();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      openSnackbar("Please fill in all fields", "error");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      openSnackbar("Please enter a valid email address", "error");
      return;
    }

    if (password !== confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      openSnackbar("Password must be at least 8 characters long", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(apiUrl("/user/register/register"), {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (res.status === 201) {
        openSnackbar("Registration successful!", "success");
        setLoading(true);

        setTimeout(() => {
          router.push("/pages/login");
        }, 2000);
      } else {
        openSnackbar(res.data.message || "Something went wrong", "error");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message: string } } };
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      openSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
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

      <h1 className="text-[18px] mb-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
        Trackyly
      </h1>

      <div className="grid w-full max-w-sm items-center text-center mb-10">
        <h1 className="mt-10 font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#2F27CE] via-[#8681E7] to-[#8681E7]">
          Register Now
        </h1>

        <form onSubmit={handleSubmit} className="pt-5 space-y-5">
          {[
            {
              id: "firstName",
              label: "First Name",
              value: firstName,
              setValue: setFirstName,
              type: "text",
            },
            {
              id: "lastName",
              label: "Last Name",
              value: lastName,
              setValue: setLastName,
              type: "text",
            },
            {
              id: "email",
              label: "Email",
              value: email,
              setValue: setEmail,
              type: "email",
            },
            {
              id: "password",
              label: "Password",
              value: password,
              setValue: setPassword,
              type: showPassword ? "text" : "password",
              isPassword: true,
              showState: showPassword,
              setShowState: setShowPassword,
            },
            {
              id: "confirmPassword",
              label: "Confirm Password",
              value: confirmPassword,
              setValue: setConfirmPassword,
              type: showConfirmPassword ? "text" : "password",
              isPassword: true,
              showState: showConfirmPassword,
              setShowState: setShowConfirmPassword,
            },
          ].map(
            ({
              id,
              label,
              value,
              setValue,
              type,
              isPassword,
              showState,
              setShowState,
            }) => (
              <div key={id} className={isPassword ? "relative" : ""}>
                <Label htmlFor={id} className="pb-2 text-[#2d2d2d]">
                  {label}
                </Label>
                <Input
                  type={type}
                  id={id}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isLoading}
                  className={`w-full focus:outline-none focus:border-[#2F27CE] focus:shadow-sm focus:shadow-[#2F27CE]/30 transition-all duration-300 ${
                    isPassword ? "pr-10" : ""
                  }`}
                />
                {isPassword && (
                  <div
                    onClick={
                      isLoading ? undefined : () => setShowState(!showState)
                    }
                    className={`absolute inset-y-10 right-3 flex items-center transition ${
                      isLoading
                        ? "cursor-not-allowed text-gray-300"
                        : "cursor-pointer text-gray-500 hover:text-[#2F27CE]"
                    }`}
                  >
                    {showState ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                )}
              </div>
            )
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-5 px-4 rounded-md transition duration-200 ${
              isLoading
                ? "bg-[#A5A8F0] cursor-not-allowed"
                : "bg-[#2F27CE] hover:bg-[#433BFF] cursor-pointer"
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>

          <div className="pt-8">
            <p className="font-light text-sm text-[#2d2d2d]">
              Already have an account?
            </p>
            <Link href="/pages/login">
              <Button
                variant="link"
                disabled={isLoading}
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
