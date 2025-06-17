"use server";

import { db } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function cancelEventAction(eventId: string, comment: string) {
  const event = await db.submission.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.status !== "ACCEPTED") {
    throw new Error("Event is not in an ACCEPTED state");
  }
  // Update the submission status to REJECTED
  await db.submission.update({
    where: { id: eventId },
    data: { status: "REJECTED" },
  });

  // TODO: Add sending email to user about visit cancellation

  return event.id;
}
