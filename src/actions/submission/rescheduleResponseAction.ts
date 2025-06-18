"use server";

import { db } from "@/lib/db";
import { sendEmail } from "../sendEmailAction";
import { formatDate } from "@/components/EmailTemplate";

export async function acceptRescheduleResponseAction(submissionId: string) {
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

  if (submission.status !== "AWAITING_USER_CONFIRMATION") {
    throw new Error("Submission is not awaiting user confirmation");
  }

  // Update the submission status to ACCEPTED
  const updatedSubmission = await db.submission.update({
    where: { id: submissionId },
    data: { status: "ACCEPTED" },
  });

  // Send confirmation email to salon
  try {
    await sendEmail({
      from: process.env.NEXT_PUBLIC_EMAIL || "noreply@salon-pati.pl",
      // This will use the default salon email from env
      subject: `[ADMIN] Klient potwierdził nowy termin: ${submission.name} ${submission.surname}`,
      text: `Klient ${submission.name} ${
        submission.surname
      } potwierdził nowy termin wizyty na ${formatDate(
        submission.startDate
      )} o ${submission.timeBlocks[0]}.`,
      html: `
        <p>Klient <strong>${submission.name} ${
        submission.surname
      }</strong> potwierdził nowy termin wizyty:</p>
        <p><strong>Data:</strong> ${formatDate(submission.startDate)}<br>
        <strong>Godzina:</strong> ${submission.timeBlocks[0]}<br>
        <strong>Czas trwania:</strong> ${submission.duration} minut</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    // We don't throw here to avoid issues if email fails
  }

  return updatedSubmission;
}

export async function rejectRescheduleResponseAction(submissionId: string) {
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

  if (submission.status !== "AWAITING_USER_CONFIRMATION") {
    throw new Error("Submission is not awaiting user confirmation");
  }

  // Update the submission status to REJECTED
  const updatedSubmission = await db.submission.update({
    where: { id: submissionId },
    data: { status: "REJECTED" },
  });

  // Send rejection notification to salon
  try {
    await sendEmail({
      from: process.env.NEXT_PUBLIC_EMAIL || "noreply@salon-pati.pl",
      // This will use the default salon email from env
      subject: `[ADMIN] Klient odrzucił proponowany termin: ${submission.name} ${submission.surname}`,
      text: `Klient ${submission.name} ${
        submission.surname
      } odrzucił proponowany termin wizyty na ${formatDate(
        submission.startDate
      )} o ${submission.timeBlocks[0]}.`,
      html: `
        <p>Klient <strong>${submission.name} ${
        submission.surname
      }</strong> odrzucił proponowany termin wizyty:</p>
        <p><strong>Data:</strong> ${formatDate(submission.startDate)}<br>
        <strong>Godzina:</strong> ${submission.timeBlocks[0]}<br>
        <strong>Czas trwania:</strong> ${submission.duration} minut</p>
        <p>Należy skontaktować się z klientem, aby ustalić inny termin lub odwołać wizytę.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    // We don't throw here to avoid issues if email fails
  }

  return updatedSubmission;
}
