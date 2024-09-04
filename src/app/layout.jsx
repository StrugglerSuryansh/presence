import { Inter } from "next/font/google";
import "../styles/globals.css";
import SessionWrapper from "@/components/Auth/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Presence",
  description:
    "Geolocation-Based Mobile Attendance for Your On-the-Go Workforce, made by the team ADSLabs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
        <head>
          <link rel="icon" href="/favicon.svg" />
          <link rel="manifest" href="/manifest.json" />
        </head>
      <SessionWrapper>
        <body className={inter.className}>{children}</body>
      </SessionWrapper>
    </html>
  );
}
