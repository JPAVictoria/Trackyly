"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  LogOut,
  Shield,
  LayoutDashboard,
  BarChart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Tooltip from "@mui/material/Tooltip"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const iconButtons = [
    {
      icon: <LogOut size={18} />,
      label: "Logout",
      onClick: ()=> router.push("/pages/login"),
      yOffset: -50,
    },
    {
      icon: <Shield size={18} />,
      label: "RBAC",
      onClick: () => router.push("/pages/roles"),
      yOffset: -100,
    },
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      onClick: () => router.push("/pages/collection"),
      yOffset: -150,
    },
    {
      icon: <BarChart size={18} />,
      label: "Analytics",
      onClick: () => router.push("/pages/dashboard"),
      yOffset: -200,
    },
  ];

  return (
    <div>
      <div className="relative w-14 h-14">
        {iconButtons.map((button, index) => {
          return (
            <Tooltip
              key={index}
              title={button.label} 
              placement="left" 
              arrow 
            >
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
          );
        })}

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
