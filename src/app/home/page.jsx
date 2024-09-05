"use client";
import { useSession, signOut } from "next-auth/react";
import MainDock from "@/components/home/Dock";
import AdminDock from "@/components/home/Admindock";
import { useState, useEffect } from "react";
import CheckInOutButton from "@/components/home/swiper";
import EmployeeLeavesGauge from "@/components/home/leaves";
import { Card } from "./modernCard";
import { NotepadText, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import Loader from "./loader";
import { AlertCheckin } from "@/components/home/ManualAlert";
import { FaceAlert } from "@/components/home/FaceAlert";

export default function HomePage() {
  const { data: session } = useSession();
  const [leaves, setLeaves] = useState(9);
  const [workingDays, setWorkingDays] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkinTime, setCheckinTime] = useState(null);
  const [checkoutTime, setCheckoutTime] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const [currentGeofence, setCurrentGeofence] = useState(null);
  const [distance, setDistance] = useState(null);
  const [nearestLocations, setNearestLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        const response = await fetch("/api/getGeofences");
        const data = await response.json();
        setGeofences(data);
        console.log("Fetched geofences:", data);
      } catch (err) {
        setError("Failed to fetch geofences: " + err.message);
      }
    };

    fetchGeofences();
  }, []);

  const handelSignOut = () => {
    signOut();
  }
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log("Updated position:", position.coords);
      },
      (err) => setError("Geolocation error: " + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const checkGeofence = () => {
      if (!currentPosition || geofences.length === 0) {
        console.log("No current position or geofences available");
        return;
      }

      console.log("Checking geofence with position:", currentPosition);
      console.log("Available geofences:", geofences);

      const insideGeofence = geofences.find((fence) =>
        isInsideGeofence(currentPosition, fence)
      );

      console.log("Inside geofence:", insideGeofence);
      setCurrentGeofence(insideGeofence || null);
    };

    checkGeofence();
  }, [currentPosition, geofences]);


  console.log("Current Position: ", currentPosition);
  console.log("Current Geofence: ", currentGeofence);

  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const checkinResponse = await fetch(
          `/api/attendance/get-checkin?email=${session?.user?.email}`
        );
        const checkinData = await checkinResponse.json();
        const checkoutResponse = await fetch(
          `/api/attendance/get-checkout?email=${session?.user?.email}`
        );
        const checkoutData = await checkoutResponse.json();

        if (checkinResponse.ok && checkoutResponse.ok) {
          setCheckinTime(checkinData.latestCheckin);
          setCheckoutTime(checkoutData.latestCheckout);
          setIsCheckedIn(
            checkinData.latestCheckin &&
              (!checkoutData.latestCheckout ||
                new Date(checkinData.latestCheckin) >
                  new Date(checkoutData.latestCheckout))
          );
        } else {
          throw new Error("Failed to fetch check-in/out times");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (session?.user?.email) {
      fetchInitialStatus();
    }
  }, [session]);

  console.log("Checked in:", checkoutTime);

  const handleRefresh = () => {
    fetchLatestAttendanceData();
  };

  const isInsideGeofence = (position, fence) => {
    const distance = calculateDistance(
      position.latitude,
      position.longitude,
      fence.lat,
      fence.lng
    );
    setDistance(distance);
    console.log(`Distance to ${fence.name}: ${distance} meters`);
    return distance <= fence.radius;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2); // a = sin²(Δφ/2) + cos(φ1).cos(φ2).sin²(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // c = 2.atan2(√a, √(1−a))
    const d = R * c; // d = R.c
    return d;
  };

  const fetchLatestAttendanceData = async () => {
    try {
      const checkinResponse = await fetch(
        `/api/attendance/get-checkin?email=${session?.user?.email}`
      );
      const checkinData = await checkinResponse.json();
      const checkoutResponse = await fetch(
        `/api/attendance/get-checkout?email=${session?.user?.email}`
      );
      const checkoutData = await checkoutResponse.json();
      console.log("Checkin data:", checkoutData);

      if (checkinResponse.ok && checkoutResponse.ok) {
        setCheckinTime(checkinData.latestCheckin);
        setCheckoutTime(checkoutData.latestCheckout);
        setIsCheckedIn(
          checkinData.latestCheckin &&
            (!checkoutData.latestCheckout ||
              new Date(checkinData.latestCheckin) >
                new Date(checkoutData.latestCheckout))
        );
      } else {
        throw new Error("Failed to fetch latest attendance data");
      }

      // Fetch updated working days
      const attendanceResponse = await fetch("/api/attendance/get-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      const attendanceData = await attendanceResponse.json();
      if (attendanceResponse.ok && attendanceData.success) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const filteredHistory = attendanceData.data.history.filter((record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getMonth() + 1 === currentMonth &&
            recordDate.getFullYear() === currentYear
          );
        });
        const uniqueDates = new Set(
          filteredHistory.map((record) => record.date)
        );
        setWorkingDays(uniqueDates.size);
      }
    } catch (err) {
      setError("Failed to fetch latest attendance data: " + err.message);
    }
  };

  useEffect(() => {
    if (checkinTime === null && checkoutTime === null) {
      setIsCheckedIn(false);
    }
    if (checkinTime !== null && checkoutTime === null) {
      setIsCheckedIn(true);
    }
    if (checkinTime !== null && checkoutTime !== null) {
      setIsCheckedIn(false);
    }
  }, [checkinTime, checkoutTime]);

  console.log("oapa", isCheckedIn);

  const handleCheckIn = async () => {
    if (isCheckedIn) {
      console.log("Already checked in");
      return;
    }
    try {
      const response = await fetch("/api/attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          location: currentGeofence.name,
          checkin_time: new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (result.success) {
        console.log(`Checked in to ${currentGeofence.name}`);
        await fetchLatestAttendanceData();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError("Check-in failed: " + err.message);
    }
  };

  const handleCheckOut = async () => {
    if (!isCheckedIn) {
      console.log("Not checked in");
      return;
    }
    try {
      const response = await fetch("/api/attendance/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          checkout_time: new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (result.success) {
        console.log("Checked out successfully");
        // Fetch the latest attendance data after successful check-out
        await fetchLatestAttendanceData();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError("Check-out failed: " + err.message);
    }
  };


  console.log("Current geofence:", currentGeofence);

  const handleManualAction = async () => {
    console.log("Current geofence:", currentGeofence);
    console.log("Is checked in:", isCheckedIn);

    if (isCheckedIn) {
      await handleCheckOut();
    } else if (currentGeofence) {
      await handleCheckIn();
      handleRefresh();
    } else {
      alert("Your request will be reviewed by the admin.");
    }
  };

  // Fetch leaves and working days
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch(
          `/api/attendance/get-leaves?email=${session?.user?.email}`
        );
        const data = await response.json();
        if (response.ok) {
          setLeaves(data.remainingLeaves);
        } else {
          throw new Error(data.message || "Failed to fetch leave records");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAttendance = async () => {
      try {
        const response = await fetch("/api/attendance/get-by-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();
          const filteredHistory = data.data.history.filter((record) => {
            const recordDate = new Date(record.date);
            return (
              recordDate.getMonth() + 1 === currentMonth &&
              recordDate.getFullYear() === currentYear
            );
          });
          const uniqueDates = new Set(
            filteredHistory.map((record) => record.date)
          );
          setWorkingDays(uniqueDates.size);
        } else {
          throw new Error(data.message || "Failed to fetch attendance");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (session?.user?.email) {
      fetchLeaves();
      fetchAttendance();
    }
  }, [session]);

  useEffect(() => {
    console.log(
      "Calculating distances. Position:",
      currentPosition,
      "Geofences:",
      geofences
    );
    const locationsWithDistance = geofences.map((loc) => {
      const distance = calculateDistance(
        currentPosition?.latitude,
        currentPosition?.longitude,
        loc.lat,
        loc.lng
      );
      console.log(`Distance for ${loc.name}:`, distance);
      return {
        ...loc,
        distance,
      };
    });
    console.log("Locations with distances:", locationsWithDistance);
    const sortedLocations = locationsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );
    setNearestLocations(sortedLocations.slice(0, 5));
  }, [currentPosition, geofences]);

  console.log("nearestLocations: ", nearestLocations[0]);

  const formatTime = (time) => {
    return time
      ? new Date(time).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";
  };

  //write a function to get the todays date in month day, year format
  const getTodaysDate = () => {
    const date = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Stop loading after 3 seconds, regardless of workingDays

    const fetchCheckTimer = setTimeout(() => {
      if (workingDays) {
        clearTimeout(fetchTimeout); // Clear the 3-second timeout if workingDays is fetched
        setIsLoading(false);
      }
    }, 2000); // Check after 1 second if workingDays are fetched

    return () => {
      clearTimeout(fetchCheckTimer);
      clearTimeout(fetchTimeout); // Clear both timeouts on component unmount
    };
  }, [workingDays]);

  useEffect(() => {
    if (nearestLocations[0]?.distance <= nearestLocations[0]?.radius) {
      setIsInside(true);
    }
  }, [nearestLocations]);

  return (
    <div className="w-full min-h-screen dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex items-center flex-col justify-center">
          <div className="flex items-center space-x-4 mt-8 pr-16 mr-2">
            <Image
              src={session?.user?.image}
              width={60}
              height={60}
              alt="user"
              className="rounded-full"
              onClick={handelSignOut}
            />

            <div className="flex flex-col justify-start">
              <h1 className="text-lg font-semibold">{session?.user?.name}</h1>
              <span className="text-sm text-gray-500">{getTodaysDate()}</span>
            </div>
          </div>

          <div className="z-10 flex mt-4 items-center justify-center">
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Today's Attendance</span>
              </AnimatedShinyText>
            </div>
          </div>

          <div className="items-center justify-center"></div>
          <div className="grid grid-cols-2 gap-4 my-4">
            <Card className="mt-2 !bg-white h-[9.5rem] w-[9.5rem]">
              <div id="checkin" className="flex flex-col">
                <div className="flex flex-row gap-1 mt-4">
                  <div className="flex justify-center items-center bg-[#00bf898b] p-1 rounded">
                    <LogIn className="text-[#108e6a]" size={20} />
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="text-[1.06rem] font-semibold">
                      Check In
                    </span>
                  </div>
                </div>
                <div className="p-4 pl-0">
                  <span className="text-3xl border-l-8 border-green-500 pl-2 text-green-600">
                    {formatTime(checkinTime)}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="mt-2 !bg-white h-[9.5rem] w-[9.5rem]">
              <div id="checkin" className="flex flex-col">
                <div className="flex flex-row gap-1 mt-4">
                  <div className="flex justify-center items-center bg-[#00bf898b] p-1 rounded">
                    <LogOut className="text-[#108e6a]" size={20} />
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="text-[1.06rem] font-semibold">
                      Check Out
                    </span>
                    <br></br>
                    <span></span>
                  </div>
                </div>
                <div className="p-4 pl-0">
                  <span className="text-3xl border-l-8 border-red-500 text-red-600 pl-2">
                    {formatTime(checkoutTime)}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="mt-2 !bg-white h-[9.5rem] w-[9.5rem]">
              <div id="checkin" className="flex flex-col">
                <div className="flex flex-row gap-1 mt-4">
                  <div className="flex justify-center items-center bg-[#00bf898b] p-1 rounded">
                    <NotepadText className="text-[#108e6a]" size={20} />
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="text-[1.03rem] font-semibold">
                      Work Days
                    </span>
                  </div>
                </div>
                <div className="p-4 pl-0">
                  <span className="text-[1.39rem] border-l-8 border-blue-500 pl-2 text-blue-600">
                    {workingDays} Days
                  </span>
                </div>
              </div>
            </Card>
            <Card className="mt-2 !bg-white h-[9.5rem] w-[9.5rem]">
              <EmployeeLeavesGauge remainingLeaves={leaves} />
            </Card>
          </div>

          <div></div>
          {!isCheckedIn ? (
            currentGeofence ? (
              <FaceAlert handel={handleManualAction} onClick={handleRefresh} />
            ) : (
              <AlertCheckin pata_nahi={handleManualAction} onClick={handleRefresh} />
            )
          ) : (
            <CheckInOutButton
              onClick={handleRefresh}
              handleCheckOut={handleCheckOut}
            />
          )}

          {!workingDays && session?.user?.role === "admin" ? (
            <AdminDock />
          ) : (
            <MainDock />
          )}
          {isInside
            ? InsideGeofence(currentGeofence?.name || nearestLocations[0]?.name)
            : OutsideGeofence(currentGeofence?.name || nearestLocations[0]?.name)}
        </div>
      )}
    </div>
  );
}

function OutsideGeofence(nearestLocation) {
  return (
    <div className="flex items-center justify-center h-4">
      <div className="flex items-center mt-8 text-xs">
        <span className="text-red-600 mb-8 font-extrabold text-6xl">.</span>
        <h4 className="text-red-400">
          Outide of GeoFencing, nearest site is{" "}
          <span className="text-red-700 font-bold">{nearestLocation}</span>
        </h4>
      </div>
    </div>
  );
}

function InsideGeofence(nearestLocation) {
  return (
    <div className="flex items-center justify-center h-4">
      <div className="flex items-center mt-8 text-xs">
        <span className="text-green-600 mb-8 font-extrabold text-6xl">.</span>
        <h4 className="text-green-500">
          Inside of GeoFencing, current site is{" "}
          <span className="text-green-700 font-bold">{nearestLocation}</span>
        </h4>
      </div>
    </div>
  );
}
