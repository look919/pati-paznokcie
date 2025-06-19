import { NextRequest, NextResponse } from "next/server";
import { sendEventReminderSmsAction } from "@/actions/sendReminderSmsAction";

export const dynamic = "force-dynamic"; // No caching

// Handler for GET requests - Vercel cron jobs use GET by default
export async function GET(req: NextRequest) {
  // Vercel Cron jobs set a special header to authenticate the request
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";

  // If this is not a Vercel Cron job request, verify it's coming from an authorized source
  // This allows manual testing of the endpoint if needed
  if (!isVercelCron && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error: "This endpoint can only be called by Vercel Cron in production",
      },
      { status: 401 }
    );
  }

  try {
    // Call the function to send reminder SMS messages
    const result = await sendEventReminderSmsAction();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing reminder SMS job:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to process reminder job: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process reminder job: Unknown error" },
      { status: 500 }
    );
  }
}

// Keep the POST handler for manual testing or if you want to trigger via POST in the future
export async function POST(req: NextRequest) {
  return GET(req);
}
