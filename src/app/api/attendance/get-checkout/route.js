import EmployeeAttendance from "@/models/EmployeeAttendance";
import connectToDatabase from "@/config/mongoose";

export async function GET(req) {
  await connectToDatabase();

  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return new Response(
      JSON.stringify({ success: false, message: "Email is required" }),
      { status: 400 }
    );
  }

  try {
    const employee = await EmployeeAttendance.findOne({ email });

    if (!employee) {
      return new Response(
        JSON.stringify({ success: false, message: "Employee not found" }),
        { status: 404 }
      );
    }

    // Get today's date and start/end of the day
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const latestHistory = employee.history.find(
      (history) =>
        new Date(history.date) >= startOfDay &&
        new Date(history.date) <= endOfDay
    );

    if (!latestHistory || latestHistory.entries.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No records found for today",
        }),
        { status: 404 }
      );
    }

    const latestEntry = latestHistory.entries
      .filter(
        (entry) =>
          new Date(entry.checkin_time) >= startOfDay &&
          new Date(entry.checkin_time) <= endOfDay
      )
      .slice(-1)[0];

    if (!latestEntry) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No records found for today",
        }),
        { status: 404 }
      );
    }

    const latestCheckout = latestEntry.checkout_time;

    if (!latestCheckout) {
      return new Response(
        JSON.stringify({ success: true, latestCheckout: null }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ success: true, latestCheckout }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
