"use server";

import { db } from "@/lib/db";

export async function rejectSubmissionAction(
  submissionId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  comment: string
) {
  const submission = await db.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  if (submission.status !== "PENDING") {
    throw new Error("Submission is not in a PENDING state");
  }
  // Update the submission status to REJECTED
  await db.submission.update({
    where: { id: submissionId },
    data: { status: "REJECTED" },
  });

  // TODO: Add sending email to user about rejection

  return submission.id;
}
