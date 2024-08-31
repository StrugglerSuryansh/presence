"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import MainDock from "@/components/home/Dock";
import AdminDock from "@/components/home/Admindock";
import { FadeLoader } from "react-spinners";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";


const page = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div className="flex justify-center items-center mt-64 h-3"><FadeLoader/></div>;
  }

  return (
    <div className="mt-0">
      <div className="flex justify-center items-center bg-white">
      <div className="bg-white rounded-lg p-6 md:w-[24rem] w-80 text-center">
        <div className="mt-32 h-32 w-64 mx-auto">
          <div className="relative inline-block">
            <Image
              className="h-32 w-32 rounded-full md:space-y-2"
              src={session?.user?.image}
              alt="User Avatar"
              width={128}
              height={128}
            />
            
          </div>
        </div>
        <Alert
            className="my-2"
          >

            <Terminal className="h-4 w-4" />
            <div className="gap-2 flex ">
              <AlertTitle className="m-0 pt-1">Name</AlertTitle>
              <Badge
                className="ml-2"
                bgColor={"#000"}
              >
                {session?.user?.name}
              </Badge>
            </div>
          </Alert>
          <Alert
            className="my-2"
          >

            <Terminal className="h-4 w-4" />
            <div className="gap-2 flex ">
              <AlertTitle className="m-0 pt-1">Email</AlertTitle>
              <Badge
                className="ml-2"
                bgColor={"#000"}

              >
                {session?.user?.email}
              </Badge>
            </div>
          </Alert><Alert
            className="my-2"
          >

            <Terminal className="h-4 w-4" />
            <div className="gap-2 flex ">
              <AlertTitle className="m-0 pt-1">Role</AlertTitle>
              <Badge
                className="ml-2 bg-red-600"
                bgColor={"#000"}
              >
                {session?.user?.role}
              </Badge>
            </div>
          </Alert><Alert
            className="my-2"
          >

            <Terminal className="h-4 w-4" />
            <div className="gap-2 flex ">
              <AlertTitle className="m-0 pt-1">ID</AlertTitle>
              <Badge
                className="ml-2"
                bgColor={"#000"}
              >
                {session?.user?.id}
              </Badge>
            </div>
          </Alert>
      </div>
    </div>

      {session?.user?.role=== "admin"? <AdminDock /> : <MainDock />}
    </div>
  );
};

export default page;
