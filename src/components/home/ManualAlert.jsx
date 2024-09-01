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

export function AlertCheckin({ pata_nahi, onClick }) {
  const handleClick = () => {
    pata_nahi();
    onClick();
  };

  return (
    <AlertDialog className="mx-auto w-20">
      <AlertDialogTrigger asChild>
        <div className="relative justify-center">
          <Button className="flex items-center gap-2 w-80">
            {" "}
            <LogIn size={18} />
            Check In
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-80 md:w-full mx-auto rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>You are outside of site location!</AlertDialogTitle>
          <AlertDialogDescription>
            This action send a manual review request to the Admin for your
            location verification.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Proceed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
