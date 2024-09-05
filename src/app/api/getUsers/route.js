import { NextResponse } from "next/server";
import connectToDatabase from "@/config/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const user = await User.find({});
    console.log("Fetched user:", user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in GET route:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
