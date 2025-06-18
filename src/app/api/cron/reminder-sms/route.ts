import { NextRequest, NextResponse } from "next/server";
import { sendEventReminderSms } from "@/actions/sendReminderSmsAction";

export const dynamic = "force-dynamic"; // No caching

export async function POST(req: NextRequest) {
  // Check if request has authorization header matching the secret
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "Server misconfiguration: CRON_SECRET not set" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Call the function to send reminder SMS messages
    const result = await sendEventReminderSms();
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
