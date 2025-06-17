"use server";

import { db } from "@/lib/db";

export async function acceptSubmissionAction(submissionId: string) {
  const submission = await db.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  if (submission.status !== "PENDING") {
    throw new Error("Submission is not in a PENDING state");
  }
  // Update the submission status to ACCEPTED
  await db.submission.update({
    where: { id: submissionId },
    data: { status: "ACCEPTED" },
  });

  // TODO: Add sending email to user about acceptance

  return submission.id;
}
