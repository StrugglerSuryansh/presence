"use client";

import React, { useState, useEffect } from "react";
import { DatePickerDemo } from "@/components/History/date";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Footprints } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import MainDock from "@/components/home/Dock";
import AdminDock from "@/components/home/Admindock";


function MainPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  const email = session?.user?.email; // Replace with actual email or use state/prop

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceData();
    }
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/attendance/get-by-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const filteredData = data.data.history.find(
            (entry) => entry.date === selectedDate
          );
          setAttendanceData(filteredData);
        } else {
          setError("Failed to fetch attendance data");
        }
      } else {
        setError("Failed to fetch attendance data");
      }
    } catch (err) {
      setError("An error occurred while fetching attendance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalHours = attendanceData
    ? attendanceData.entries.reduce((sum, entry) => sum + entry.total_hours, 0)
    : 0;

  return (
    <div className="flex overflow-x-hidden justify-center items-center mt-8 md:w-[40rem] w-auto px-4 py-6 mx-auto flex-col space-y-2">
      
      <DatePickerDemo date={selectedDate} setDate={setSelectedDate} />

      {loading && <p>Loading attendance data...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

     { selectedDate && (totalHours !== 0) && <div className="font-semibold border-l-8 border-blue-500 pl-2 mr-auto ml-8 md:ml-[10rem]">
        Total Working Hours <br></br>
        {totalHours} Hrs
      </div>
    }

      {attendanceData && (
        <div className="">
          {attendanceData.entries.map((entry, index) => (
            <div key={index}>
              
              <Alert className="my-2 w-80">
                <Footprints className="h-4 w-4" />
                <div>
                  <div className="gap-2 flex ">
                    <AlertTitle className="m-0 pt-1">
                      {entry.location}
                    </AlertTitle>
                    <Badge className="ml-2" bgColor={"#000000"}>
                      {entry.total_hours} Hrs
                    </Badge>
                  </div>
                  <AlertDescription>
                    <div className="flex justify-between text-[13px] py-2">
                      <p className="border-l-8 border-white border-l-green-500 pl-1 text-green-700">
                        Checkin:{" "}
                        {new Date(entry.checkin_time).toLocaleTimeString(
                          "en-GB",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                      <p className="border-l-8 border-white border-l-red-500 pl-1 text-red-700">
                        Checkout:{" "}
                        {new Date(entry.checkout_time).toLocaleTimeString(
                          "en-GB",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && !attendanceData && selectedDate && (
        <p className="font-semibold text-md text-red-500">
          No attendance data found for the selected date.
        </p>
      )}

      {/* Other components and content */}
      {session?.user?.role=== "admin"? <AdminDock /> : <MainDock />}

    </div>
  );
}

export default MainPage;
