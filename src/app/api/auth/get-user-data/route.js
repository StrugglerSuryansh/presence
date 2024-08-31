import User from "@/models/User";
import connectToDatabase from '@/config/mongoose'; // Adjust the import path according to your project structure

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email is required' }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    // Exclude the password field from the response
    const { password, ...userData } = user._doc;

    return new Response(
      JSON.stringify({ success: true, data: userData }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// export const runtime = 'edge'; // Optional: Specify if you want to use the Edge Runtime
