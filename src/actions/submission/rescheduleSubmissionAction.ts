"use server";

import { db } from "@/lib/db";
import { createSubmissionAction } from "./createSubmissionAction";
import { sendEmail } from "../sendEmailAction";
import { EmailTemplate, formatDate } from "@/components/EmailTemplate";

type RescheduleSubmissionActionParams = {
  submissionId: string;
  newDate: Date;
  newTime: string;
  comment: string | undefined;
};

export async function rescheduleSubmissionAction(
  params: RescheduleSubmissionActionParams
) {
  const { submissionId, newDate, newTime, comment } = params;

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
    { isReschedule: true, blockSendingEmail: true }
  );

  // Send a comprehensive email with information about the rescheduling and new date
  try {
    // Get the new submission to include all details about the new appointment
    const newSubmission = await db.submission.findUnique({
      where: { id: newSubmissionId },
      include: {
        treatments: {
          include: {
            treatment: true,
          },
        },
      },
    });

    if (!newSubmission) {
      throw new Error("New submission not found");
    }

    const formattedOldDate = formatDate(submission.startDate);
    const formattedNewDate = formatDate(newSubmission.startDate);
    const formattedNewTime = newSubmission.timeBlocks[0];

    // List of treatments
    const treatmentsList = newSubmission.treatments
      .map(
        (item) =>
          `<li>${item.treatment.name} - ${item.treatment.price.toFixed(
            2
          )} zł</li>`
      )
      .join("");

    const emailContent = `
        <p>Dzień dobry ${submission.name},</p>
        <p>Przepraszamy, ale nie mogliśmy zaakceptować Twojej rezerwacji na dzień <strong>${formattedOldDate}</strong> w wybranym przez Ciebie terminie.</p>
        
        ${
          comment
            ? `
        <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
          <h3 style="margin-top: 0; color: #4a5568;">Powód:</h3>
          <p>${comment}</p>
        </div>
        `
            : ""
        }
        
        <p>Proponujemy jednak nowy termin wizyty:</p>
        
        <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
          <h2 style="margin-top: 0; color: #4a5568;">Szczegóły nowej wizyty:</h2>
          <p><strong>Data:</strong> ${formattedNewDate}</p>
          <p><strong>Godzina:</strong> ${formattedNewTime}</p>
          <p><strong>Czas trwania:</strong> ${newSubmission.duration} minut</p>
          
          <h3 style="color: #4a5568;">Wybrane usługi:</h3>
          <ul>
            ${treatmentsList}
          </ul>
        </div>

        <p>Prosimy o potwierdzenie, czy zaproponowany termin Ci odpowiada, klikając w poniższy przycisk:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://salon-pati.pl/zgloszenie/zaakceptuj?id=${newSubmissionId}" class="button" style="margin-right: 15px;">Akceptuję termin</a>
          <a href="https://salon-pati.pl/zgloszenie/odrzuc?id=${newSubmissionId}" class="button" style="background-color: #e53e3e;">Odrzucam termin</a>
        </div>
        
        <p>Możesz też odpowiedzieć na tego maila lub skontaktować się z nami telefonicznie, jeśli masz inne pytania.</p>
        <p>Przepraszamy za wszelkie niedogodności.</p>
        <p>Pozdrawiamy,<br>Zespół Salonu Kosmetycznego Pati</p>
      `;

    const emailTemplate = EmailTemplate({
      preheader: `Propozycja nowego terminu wizyty: ${formattedNewDate} o ${formattedNewTime}`,
      title: "Propozycja nowego terminu wizyty",
      content: emailContent,
    });

    await sendEmail({
      to: submission.email,
      subject: "Propozycja nowego terminu wizyty - Salon Kosmetyczny Pati",
      text: `Nie mogliśmy zaakceptować Twojej rezerwacji na ${formattedOldDate}. Proponujemy nowy termin na ${formattedNewDate} o ${formattedNewTime}. Sprawdź maila, aby zaakceptować lub odrzucić propozycję.`,
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Failed to send additional rescheduling info email:", error);
    // We don't throw here to avoid rolling back if email fails
  }

  return newSubmissionId;
}
