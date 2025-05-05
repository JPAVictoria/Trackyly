"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRoleGuard(allowedRoles: string[]) {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/pages/login"); 
      return;
    }

    const user = JSON.parse(userData);
    const userRole = user?.role;

    if (!allowedRoles.includes(userRole)) {
      router.push("/pages/unauthorized"); 
    }
  }, [router, allowedRoles]);
}