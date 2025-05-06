import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, LogOut, Shield, LayoutDashboard, BarChart, Plus } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; 
import clsx from "clsx";
import Tooltip from "@mui/material/Tooltip";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useLoading } from "@/app/context/loaderContext";
import Cookies from "js-cookie";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname(); 

  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role); 
    }
  }, []);

  useEffect(() => {
    if (userRole && !hasInitialized) {
      setHasInitialized(true);
      
      const validPages = [
        "/pages/adminDashboard",
        "/pages/merchandiserDashboard",
        "/pages/forms",
        "/pages/userRoles",
        "/pages/createForm"
      ];
      
      if (!validPages.includes(pathname)) {
        if (userRole === "ADMIN") {
          router.push("/pages/adminDashboard");
        } else if (userRole === "MERCHANDISER") {
          router.push("/pages/merchandiserDashboard");
        }
      }
    }
  }, [userRole, hasInitialized, pathname, router]);

  const iconButtons = [
    {
      icon: <LogOut size={18} />,
      label: "Logout",
      onClick: async () => await handleLogout(),
      yOffset: -50, 
    },
    {
      icon: <Shield size={18} />,
      label: "RBAC",
      onClick: () => router.push("/pages/userRoles"),
      yOffset: -100,
    },
    {
      icon: <LayoutDashboard size={18} />,
      label: "Forms",
      onClick: () => router.push("/pages/forms"),
      yOffset: -150,
    },
    {
      icon: <BarChart size={18} />,
      label: "Dashboard",
      onClick: () => {
        if (userRole === "ADMIN") {
          router.push("/pages/adminDashboard");
        } else {
          router.push("/pages/merchandiserDashboard");
        }
      },
      yOffset: -200,
    },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      Cookies.remove("token");
      localStorage.removeItem("user");
      openSnackbar("Logged out successfully!", "success");
      router.push("/pages/login");
    } catch (error) {
      console.log(error);
      openSnackbar("Logout failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredIconButtons =
    userRole === "ADMIN"
      ? iconButtons
      : userRole === "MERCHANDISER"
      ? [
          ...iconButtons.filter((button) => ["Logout", "Dashboard"].includes(button.label)),
          {
            icon: <Plus size={18} />,
            label: "Create",
            onClick: () => {
              // Trigger a hard reload to the create form page
              window.location.href = "/pages/createForm"; // Forces a full page reload
            },
            yOffset: -150,
          },
        ].map((button, index) => ({
          ...button,
          yOffset: index === 0 ? -50 : index === 1 ? -100 : -150,
        }))
      : [];

  return (
    <div className="absolute bottom-15 right-20 z-50">
      <div className="relative w-14 h-14">
        {filteredIconButtons.map((button, index) => (
          <Tooltip key={index} title={button.label} placement="left" arrow>
            <motion.button
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: 0,
                y: isOpen ? button.yOffset : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={clsx(
                "absolute w-10 h-10 rounded-full bg-[#2F27CE] text-white flex items-center justify-center shadow-lg cursor-pointer",
                "hover:bg-[#1A1A99]"
              )}
              onClick={button.onClick}
              aria-label={button.label}
            >
              {button.icon}
            </motion.button>
          </Tooltip>
        ))}

        <Tooltip title="Menu" placement="left" arrow>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            className={clsx(
              "absolute w-10 h-10 rounded-full bg-[#2F27CE] text-white flex items-center justify-center shadow-lg transition-transform duration-300 cursor-pointer",
              { "rotate-45": isOpen },
              "hover:bg-[#1A1A99] hover:scale-110 hover:shadow-xl"
            )}
          >
            <Menu size={20} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
