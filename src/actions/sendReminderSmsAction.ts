"use server";

import { db } from "@/lib/db";
import { sendSms } from "./sendSmsAction";
import dayjs, { formatDate, formatTime } from "@/lib/time";

export async function sendEventReminderSmsAction() {
  try {
    const tomorrow = dayjs().add(1, "day").startOf("day").toDate();
    const endOfTomorrow = dayjs(tomorrow).endOf("day").toDate();

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
        const eventTime = formatTime(submission.startDate);
        const eventDate = formatDate(submission.startDate);

        // Compose the simple message with just date and time
        const message = `Przypominamy o Twojej wizycie w salonie jutro, ${eventDate} o godz. ${eventTime}.`;

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
