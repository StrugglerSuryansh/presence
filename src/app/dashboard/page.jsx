"use client";
import React from "react";
import { useSession } from "next-auth/react";
import MainDock from "@/components/home/Dock";
import AdminDock from "@/components/home/Admindock";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <div className="h-screen w-full bg-gray-100 p-4">
      {session?.user?.role === "admin" ? <AdminDock /> : <MainDock />}

    </div>
  );
};

export default DashboardPage;
