"use server";

import { db } from "@/lib/db";
import { createSubmissionAction } from "./createSubmissionAction";

type RescheduleSubmissionActionParams = {
  submissionId: string;
  newDate: Date;
  newTime: string;
  comment: string | undefined;
};

export async function rescheduleSubmissionAction(
  params: RescheduleSubmissionActionParams
) {
  const { submissionId, newDate, newTime } = params;

  const submission = await db.submission.findUnique({
    where: { id: submissionId },
    include: {
      treatments: {
        include: {
          treatment: true,
        },
      },
    },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  if (submission.status !== "PENDING") {
    throw new Error("Submission is not in a PENDING state");
  }
  // Update the submission status to Rejected
  await db.submission.update({
    where: { id: submissionId },
    data: { status: "RESCHEDULED" },
  });

  // Create a new submission with the new date and time
  const newSubmissionId = await createSubmissionAction(
    {
      name: submission.name,
      surname: submission.surname,
      email: submission.email,
      phone: submission.phone,
      duration: submission.duration,
      date: newDate,
      startTime: newTime,
      treatments: submission.treatments.map((tr) => ({
        id: tr.treatment.id,
        name: tr.treatment.name,
        price: tr.treatment.price,
        duration: tr.treatment.duration,
      })),
    },
    { isReschedule: true }
  );
  // TODO: Add sending email to user about new submission with option to accept or reject

  return newSubmissionId;
}
