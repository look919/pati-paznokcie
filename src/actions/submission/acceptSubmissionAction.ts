"use server";

import { db } from "@/lib/db";
import { sendEmail } from "../sendEmailAction";
import { EmailTemplate } from "@/components/EmailTemplate";
import { formatDate, formatTime } from "@/lib/time";

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

const generateAcceptanceEmailTemplate = (
  submission: SubmissionWithTreatments
) => {
  const formattedDate = formatDate(submission.startDate);
  const formattedTime = formatTime(submission.timeBlocks[0]);

  const emailContent = `
    <p>Dzień dobry ${submission.name},</p>
    <p>Z przyjemnością informujemy, że Twoja rezerwacja wizyty w naszym salonie została zaakceptowana.</p>
    <p>Wyślemy Ci SMSem przypomnienie dzień przed planowaną wizytą.</p>

    <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
      <h2 style="margin-top: 0; color: #4a5568;">Szczegóły wizyty:</h2>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Godzina:</strong> ${formattedTime}</p>
      <p><strong>Czas trwania:</strong> ${submission.duration} minut</p>
    </div>

    <p>Jeśli zaistnieje potrzeba zmiany terminu wizyty, prosimy o kontakt z minimum 24-godzinnym wyprzedzeniem.</p>
    <p>Dziękujemy za wybór naszego salonu i czekamy na spotkanie z Tobą!</p>
    <p>Pozdrawiamy,<br>Zespół Salonu Kosmetycznego Pati</p>
  `;

  return EmailTemplate({
    preheader: `Twoja rezerwacja na ${formattedDate} o ${formattedTime} została potwierdzona.`,
    title: "Potwierdzenie rezerwacji",
    content: emailContent,
  });
};

export async function acceptSubmissionAction(submissionId: string) {
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

  // Update the submission status to ACCEPTED
  await db.submission.update({
    where: { id: submissionId },
    data: { status: "ACCEPTED" },
  });

  // Send confirmation email to client
  try {
    const emailTemplate = generateAcceptanceEmailTemplate(submission);
    await sendEmail({
      to: submission.email,
      subject: "Potwierdzenie rezerwacji - Salon Kosmetyczny Pati",
      text: `Twoja rezerwacja na ${formatDate(submission.startDate)} o ${
        submission.timeBlocks[0]
      } została potwierdzona.`,
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Failed to send acceptance email:", error);
    // We don't throw here to avoid rolling back the submission acceptance if email fails
  }

  return submission.id;
}
