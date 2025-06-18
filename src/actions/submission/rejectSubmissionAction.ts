"use server";

import { db } from "@/lib/db";
import { sendEmail } from "../sendEmailAction";
import {
  EmailTemplate,
  formatDate,
  formatTime,
} from "@/components/EmailTemplate";

type SubmissionWithTreatments = {
  id: string;
  name: string;
  surname: string;
  email: string;
  startDate: Date;
  timeBlocks: string[];
  duration: number;
  treatments: {
    treatment: {
      id: string;
      name: string;
      price: number;
      duration: number;
    };
  }[];
};

const generateRejectionEmailTemplate = (
  submission: SubmissionWithTreatments,
  comment: string
) => {
  const formattedDate = formatDate(submission.startDate);
  const formattedTime = formatTime(submission.timeBlocks[0]);

  const emailContent = `
    <p>Dzień dobry ${submission.name},</p>
    <p>Dziękujemy za przesłanie prośby o rezerwację wizyty w naszym salonie.</p>
    
    <p>Niestety, musimy poinformować, że Twoja rezerwacja na dzień <strong>${formattedDate}</strong> o godzinie <strong>${formattedTime}</strong> nie może zostać zaakceptowana.</p>
    
    ${
      comment
        ? `
    <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
      <h3 style="margin-top: 0; color: #4a5568;">Powód odrzucenia:</h3>
      <p>${comment}</p>
    </div>
    `
        : ""
    }
    
    <p>Jeśli masz jakiekolwiek pytania, skontaktuj się z nami telefonicznie lub mailowo.</p>
    
    <p>Pozdrawiamy,<br>Zespół Salonu Kosmetycznego Pati</p>
  `;

  return EmailTemplate({
    preheader: `Informacja o odrzuceniu rezerwacji na ${formattedDate}`,
    title: "Odmowa rezerwacji",
    content: emailContent,
  });
};

export async function rejectSubmissionAction(
  submissionId: string,
  comment: string
) {
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

  // Update the submission status to REJECTED
  await db.submission.update({
    where: { id: submissionId },
    data: { status: "REJECTED" },
  });

  // Send rejection email to client
  try {
    const emailTemplate = generateRejectionEmailTemplate(submission, comment);
    await sendEmail({
      from: process.env.NEXT_PUBLIC_EMAIL || "noreply@salon-pati.pl",
      to: submission.email,
      subject: "Informacja o rezerwacji - Salon Kosmetyczny Pati",
      text: `Twoja rezerwacja na ${formatDate(submission.startDate)} o ${
        submission.timeBlocks[0]
      } została odrzucona.${comment ? ` Powód: ${comment}` : ""}`,
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    // We don't throw here to avoid rolling back the submission rejection if email fails
  }

  return submission.id;
}
