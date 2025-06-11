import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function useRoleGuard(allowedRoles: string[]) {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (!role) {
      router.push("/pages/login");
    } else if (!allowedRoles.includes(role)) {
      router.push("/pages/unauthorized");
    }
  }, [role, allowedRoles, router]);
}
