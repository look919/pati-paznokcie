import { NextRequest, NextResponse } from "next/server";
import { sendEventReminderSmsAction } from "@/actions/sendReminderSmsAction";

export const dynamic = "force-dynamic"; // No caching

// Handler for GET requests - Vercel cron jobs use GET by default
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  console.info(
    "Cron job triggered for reminder SMS at:",
    new Date().toISOString()
  );

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.info(
      "Unauthorized access attempt to reminder SMS cron job",
      new Date().toISOString()
    );

    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "This endpoint can only be called by Vercel Cron in production",
      new Date().toISOString()
    );

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
    console.info(
      "Reminder SMS job completed successfully:",
      new Date().toISOString()
    );

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
