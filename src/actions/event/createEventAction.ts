"use server";

import dayjs from "@/lib/time";
import { db } from "@/lib/db";
import { TIME_FORMAT } from "@/lib/time";
import { SubmissionFullSchema } from "@/app/zgloszenie/SubmissionForm";
import { sendEmail } from "../sendEmailAction";
import {
  EmailTemplate,
  formatDate,
  formatTime,
} from "@/components/EmailTemplate";

const generateEventCreationEmailTemplate = (submission: {
  id: string;
  name: string;
  email: string;
  startDate: Date;
  timeBlocks: string[];
  duration: number;
  treatments: {
    treatment: {
      name: string;
      price: number;
    };
  }[];
}) => {
  const formattedDate = formatDate(submission.startDate);
  const formattedTime = formatTime(submission.timeBlocks[0]);

  // Calculate total price
  const totalPrice = submission.treatments.reduce(
    (sum, item) => sum + item.treatment.price,
    0
  );

  const treatmentsList = submission.treatments
    .map(
      (item) =>
        `<li>${item.treatment.name} - ${item.treatment.price.toFixed(
          2
        )} zł</li>`
    )
    .join("");

  const emailContent = `
    <p>Dzień dobry ${submission.name},</p>
    <p>Informujemy, że wizyta w naszym salonie została zarezerwowana.</p>
    
    <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
      <h2 style="margin-top: 0; color: #4a5568;">Szczegóły wizyty:</h2>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Godzina:</strong> ${formattedTime}</p>
      <p><strong>Czas trwania:</strong> ${submission.duration} minut</p>
      
      <h3 style="color: #4a5568;">Wybrane usługi:</h3>
      <ul>
        ${treatmentsList}
      </ul>
      <p style="font-weight: bold; margin-top: 10px;">Całkowita cena: ${totalPrice.toFixed(
        2
      )} zł</p>
    </div>

    <p>Jeśli zaistnieje potrzeba zmiany terminu wizyty, prosimy o kontakt z minimum 24-godzinnym wyprzedzeniem.</p>
    <p>Dziękujemy za wybór naszego salonu i czekamy na spotkanie z Tobą!</p>
    <p>Pozdrawiamy,<br>Zespół Salonu Kosmetycznego Pati</p>
  `;

  return EmailTemplate({
    preheader: `Twoja wizyta na ${formattedDate} o ${formattedTime} została zarezerwowana.`,
    title: "Potwierdzenie rezerwacji",
    content: emailContent,
  });
};

export async function createEventAction(data: SubmissionFullSchema) {
  const { name, surname, email, phone, date, startTime, duration, treatments } =
    data;

  const startDate = dayjs(date)
    .set("hour", dayjs(startTime, TIME_FORMAT).hour())
    .set("minute", dayjs(startTime, TIME_FORMAT).minute())
    .toDate();

  const endDate = dayjs(startDate).add(duration, "minute").toDate();
  const timeBlocks = Array.from({ length: duration / 15 }, (_, i) =>
    dayjs(startTime, TIME_FORMAT)
      .add(i * 15, "minute")
      .format(TIME_FORMAT)
  );

  const profile = await db.profile.upsert({
    where: { email },
    update: {},
    create: {
      name,
      surname,
      email,
      phone,
    },
  });

  const submission = await db.submission.create({
    data: {
      name,
      surname,
      email,
      phone,
      startDate,
      endDate,
      timeBlocks,
      duration,
      status: "ACCEPTED",
      profile: {
        connect: { id: profile.id },
      },
      treatments: {
        create: treatments.map((treatment) => ({
          treatment: {
            connect: { id: treatment.id },
          },
        })),
      },
    },
    include: {
      treatments: {
        include: {
          treatment: true,
        },
      },
      profile: true,
    },
  });

  // Send confirmation email to the client
  try {
    const emailTemplate = generateEventCreationEmailTemplate(submission);
    await sendEmail({
      from: process.env.NEXT_PUBLIC_EMAIL || "noreply@salon-pati.pl",
      to: email,
      subject: "Potwierdzenie wizyty - Salon Kosmetyczny Pati",
      text: `Twoja wizyta na ${formatDate(
        startDate
      )} o ${startTime} została zarezerwowana.`,
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    // We don't throw here to avoid rolling back the event creation if email fails
  }

  return submission.id;
}
