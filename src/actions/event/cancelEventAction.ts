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

const generateCancellationEmailTemplate = (
  event: SubmissionWithTreatments,
  comment: string
) => {
  const formattedDate = formatDate(event.startDate);
  const formattedTime = formatTime(event.timeBlocks[0]);

  const emailContent = `
    <p>Dzień dobry ${event.name},</p>
    <p>Z przykrością informujemy, że musimy odwołać Twoją wizytę w naszym salonie.</p>
    
    <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
      <h2 style="margin-top: 0; color: #4a5568;">Szczegóły odwołanej wizyty:</h2>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Godzina:</strong> ${formattedTime}</p>
      <p><strong>Czas trwania:</strong> ${event.duration} minut</p>
    </div>
    
    ${
      comment
        ? `
    <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
      <h3 style="margin-top: 0; color: #4a5568;">Powód odwołania:</h3>
      <p>${comment}</p>
    </div>
    `
        : ""
    }
    
    <p>Przepraszamy za wszelkie niedogodności związane z odwołaniem wizyty.</p>
    <p>Zachęcamy do wybrania nowego terminu wizyty.</p>
    
    <a href="https://salon-pati.pl/submission" class="button">Umów nową wizytę</a>
    
    <p>Pozdrawiamy,<br>Zespół Salonu Kosmetycznego Pati</p>
  `;

  return EmailTemplate({
    preheader: `Informacja o odwołaniu wizyty na ${formattedDate}`,
    title: "Odwołanie wizyty",
    content: emailContent,
  });
};

export async function cancelEventAction(eventId: string, comment: string) {
  const event = await db.submission.findUnique({
    where: { id: eventId },
    include: {
      treatments: {
        include: {
          treatment: true,
        },
      },
    },
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

  // Send cancellation email to client
  try {
    const emailTemplate = generateCancellationEmailTemplate(event, comment);
    await sendEmail({
      to: event.email,
      subject: "Odwołanie wizyty - Salon Kosmetyczny Pati",
      text: `Twoja wizyta na ${formatDate(event.startDate)} o ${
        event.timeBlocks[0]
      } została odwołana.${comment ? ` Powód: ${comment}` : ""}`,
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
    // We don't throw here to avoid rolling back the event cancellation if email fails
  }

  return event.id;
}
