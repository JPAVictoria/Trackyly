"use client";

import { useEffect, useState } from "react";

type UserInfo = {
  firstName: string;
  lastName: string;
  role: string;
};

export default function NameBlock() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const capitalizeFirstLetter = (str: string) => {
    if (str && str.length > 0) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return str;
  };

  return (
    <div className="bg-white shadow-md rounded-sm p-4 w-72 mx-auto"> 
      <h3 className="font-semibold text-indigo-700">
        {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
      </h3>
      <p className="text-sm text-gray-500">
        {user ? capitalizeFirstLetter(user.role) : "Loading..."}
      </p>
    </div>
  );
}
