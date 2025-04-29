// import { useEffect, useState } from "react";

// export default function NavbarTitle() {
//   const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []); 

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   return (
//     <div className="bg-[#F3E7C7] p-4 rounded-md text-[#3E2723]">
//       <h1 className="text-xl font-bold">
//         Hello
//       </h1>
//       <p className="text-[14px] pt-1">Admin</p>
//     </div>
//   );
// }

"use client";

export default function UserProfileCard() {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full">
      <h3 className="font-semibold text-indigo-700">Andre Victoria</h3>
      <p className="text-sm text-gray-500">Admin</p>
    </div>
  );
}

