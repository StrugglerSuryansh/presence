"use client";
import Image from "next/image";
import React, { createContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import BlurFade from "@/components/magicui/blur-fade";
import Globe from "@/components/home/globe";
import NewFooter from "@/components/home/footer";

export default function Home() {
  return (
    <>
      <main className="">
        <nav className="m-0 p-0 fixed top-0 w-full bg-white z-50">
          <div className="mx-auto">
            <div className="flex justify-between items-center py-4 px-4 md:px-16">
              <div className="w-40 md:w-64">
                <Image src="/logo.svg" alt="Logo" width="200" height="200" />
              </div>
              <div>
                <Link href="/login" className="text-blue-500 font-semibold">
                  Login
                </Link>
                <Link href="/signup">
                  <Button className="ml-2 bg-blue-500 font-semibold hover:!bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex md:flex-row md-0 md:mb-32 flex-col md:mt-32 mt-16 px-3 md:px-32 mx-auto">
          <div className="h-full w-full max-w-[40rem] items-center justify-center overflow-hidden pt-8">
            <BoxReveal boxColor={"#00bf89"} duration={0.5}>
              <p className="md:text-[3rem] text-[1.75rem] font-semibold">
                Geolocation-Based Mobile Attendance for Your On-the-Go Workforce{" "}
                <span className="text-[#2cb68f]">.</span>
              </p>
            </BoxReveal>

            <BoxReveal boxColor={"#00bf89"} duration={0.5}>
              <h2 className="mt-[.5rem] text-[1rem]">
                Attendance Management app for{" "}
                <span className="text-[#00bf89]">GAIL (India) Limited</span>
              </h2>
            </BoxReveal>

            <BoxReveal boxColor={"#00bf89"} duration={0.5}>
              <div className="mt-[1.5rem]">
                <p>
                  -&gt; Real-time attendance tracking with geolocation accuracy
                  up to 10 meters. <br />
                  -&gt; Automatic work hours calculation to streamline employee
                  management. <br />
                  -&gt; Comprehensive leave management system, including
                  approval and tracking of Paid Leaves (PL). <br />
                  -&gt; Built using
                  <span className="font-semibold text-[#2cb68f]"> Next.js</span>
                  ,
                  <span className="font-semibold text-[#00bf89]"> MongoDB</span>
                  ,
                  <span className="font-semibold text-[#00bf89]">
                    {" "}
                    Tailwind CSS
                  </span>
                  , and
                  <span className="font-semibold text-[#00bf89]">
                    {" "}
                    Capacitor
                  </span>
                  . <br />
                </p>
              </div>
            </BoxReveal>

            <BoxReveal boxColor={"#00bf89"} duration={0.5}>
              <Link href={"/signup"}>
                <Button className="mt-[1.6rem] bg-blue-500 hover:!bg-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link href={"/https://github.com/ads-labs/presence/releases/download/1.0.1/Presence.apk"}>
                <Button className="mt-[1.6rem] bg-blue-500 hover:!bg-blue-700 ml-2">
                  Download App
                </Button>
              </Link>
            </BoxReveal>
          </div>
          <BlurFade delay={0.25 * 2} inView>
            <div id="main-image" className="md:px-8 py-16 md:py-0">
              <img
                src={"/images/main-image.webp"}
                width={600}
                height={400}
                alt="main-image"
              ></img>
            </div>
          </BlurFade>
        </div>

        {/* <World globeConfig={globeConfig} /> */}
        <Globe />
        {/* <Globe /> */}
        <BlurFade delay={0.25 * 2} inView>
          <div
            id="gps-tracking"
            className="flex flex-col justify-center items-center gap-4 md:mt-16 !mt-0 md:p-0 px-4 py-4"
          >
            <p className="md:text-[3rem] text-[1.75rem] font-bold">
             Real Time Attendance Tracking, No hassle! <span className="text-[#2cb68f]">.</span>
            </p>
            <h2 className="mt-[.5rem] text-[0.3] md:text-[1rem] text-center font-semibold">
             Say goodbye to manual attendance with our automated GPS tracking functionality app Presence.{" "}
              <br />
              Its a user friendly app that aims at managing the workhours of your workforce seamlessly {" "}
              <br />
              ensuring accuracy and reliability with GPS enabled check-ins and time tracking.{" "}
              </h2>
            <div>
              <Image
                src={"/images/gps-time-tracking.webp"}
                height={700}
                width={700}
                alt="gps-time-tracking"
              ></Image>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={0.25 * 2} inView>
          <div
            id="retrieve-location"
            className="flex flex-col md:flex-row md:px-[16rem] px-2 md:mt-32 mb-32 mt-2"
          >
            <div id="content" className="md:w-[36rem] px-4 gap-4 mb-8">
              <p className="md:text-[3rem] text-[1.75rem] font-bold">
                Geo Fenced Attendance Zones{" "}
                <span className="text-[#2cb68f]">.</span>
              </p>
              <h2 className="mt-[.5rem] text-[0.3] md:text-[1rem] font-semibold">
              Sets up specific areas where attendance is logged  to ensure presence at right location <br />
              and generates detailed attendance report including the check-in and check-out times ,<br />
              the workhours associated with specified location and keeps a record of the leaves taken and remaining ones .
              </h2>
            </div>
            <div id="image" className="px-8 h-auto w-auto">
              <Image
                src={"/images/retrieve-location-and-time.webp"}
                height={400}
                width={400}
                alt="retrieve-location"
              ></Image>
            </div>
          </div>
        </BlurFade>
        <NewFooter />
      </main>
    </>
  );
}
