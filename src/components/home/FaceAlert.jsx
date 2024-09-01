"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Webcam from "react-webcam";
import * as React from "react";

export function FaceAlert({ handel, onClick }) {
  const videoConstraints = {
    facingMode: "user",
    mirrored: false,
    imageSmoothing: true,
  };

  const handleClick = () => {
    handel();
    onClick();
  };

  return (
    <AlertDialog className="m-0 p-0">
      <AlertDialogTrigger asChild>
        <div className="relative justify-center">
          <Button className="flex items-center gap-2 w-80">
            {" "}
            <LogIn size={18} />
            Check In
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-80 mx-auto rounded-lg">
        <AlertDialogHeader className="flex items-center justify-center">
          <div className=" top-90 w-[18rem] h-[18rem] rounded-full overflow-hidden bg-slate-800">
            <Webcam
              className=" w-[18rem] h-[18rem]  scale-150 rounded-full text-white"
              videoConstraints={videoConstraints}
            />
          </div>
          <AlertDialogTitle>AI FACE VERIFICATION!!</AlertDialogTitle>
          <AlertDialogDescription className="mt-4 mb-4">
            Be still and look straight into the camera.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Capture</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
