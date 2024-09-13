"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import MainDock from "@/components/home/Dock";
import AdminDock from "@/components/home/Admindock";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen w-full bg-gray-100 p-4">
      {session?.user?.role === "admin" ? <AdminDock /> : <MainDock />}

      <div style="overflow: hidden;">
        <iframe
            src="https://pagedone.io/storage/templates/HR-Management-Dashboard-Tailwind-CSS-Template-free-figma-file/HR-Management-Dashboard-Tailwind-CSS-Template-free-figma-file/index.html"
            frameborder="0" width="100%" height="100%" style="border: none;"></iframe>
    </div>
    </div>
  );
};

export default DashboardPage;
