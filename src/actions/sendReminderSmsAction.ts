"use server";

import { db } from "@/lib/db";
import { sendSms } from "./sendSmsAction";

export async function sendEventReminderSms() {
  // Only run in production to prevent accidental SMS sending
  if (process.env.NODE_ENV !== "production") {
    return {
      success: true,
      message: "Skipped in development",
      successful: 0,
      failed: 0,
    };
  }

  try {
    // Get the start of tomorrow and end of tomorrow
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Find all accepted submissions scheduled for tomorrow
    const tomorrowEvents = await db.submission.findMany({
      where: {
        status: "ACCEPTED",
        startDate: {
          gte: tomorrow,
          lte: endOfTomorrow,
        },
      },
    });

    // Send SMS for each submission
    const results = await Promise.allSettled(
      tomorrowEvents.map(async (submission) => {
        // Format the time nicely
        const eventTime = submission.startDate.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const eventDate = submission.startDate.toLocaleDateString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        // Compose the simple message with just date and time
        const message = `Przypominamy o Twojej wizycie w salonie jutro, ${eventDate} o godz. ${eventTime}. W razie pytań, prosimy o kontakt. Zespół Pati.`;

        // Send the SMS
        return await sendSms({
          to: submission.phone,
          message,
        });
      })
    );

    // Count successes and failures
    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return {
      success: true,
      message: `Sent ${successful} reminders. Failed: ${failed}.`,
      successful,
      failed,
    };
  } catch (error) {
    console.error("Error sending reminder SMS:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to send reminder SMS: ${error.message}`);
    }
    throw new Error("Failed to send reminder SMS: Unknown error");
  }
}
