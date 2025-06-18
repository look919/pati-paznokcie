"use server";

import { db } from "@/lib/db";
import dayjs from "dayjs";
import { TIME_FORMAT } from "@/lib/time";
import { SubmissionFullSchema } from "@/app/zgloszenie/SubmissionForm";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { sendEmail } from "../sendEmailAction";
import {
  EmailTemplate,
  formatDate,
  formatTime,
} from "@/components/EmailTemplate";

dayjs.extend(customParseFormat);

type Options = {
  isReschedule?: boolean;
  blockSendingEmail?: boolean;
};

const generateSubmissionEmailTemplate = (
  submission: {
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
  },
  isReschedule: boolean
) => {
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
    <p>Dziękujemy za rezerwację terminu w naszym salonie!</p>
    <p>Wkrótce nasz zespół zweryfikuje Twoją rezerwację i sprawdzi czy proponowany termin jest dostępny.</p>
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

    <p>Możesz skontaktować się z nami telefonicznie lub odpisać na tego maila.</p>
    <p>Po zatwierdzeniu terminu otrzymasz maila z potwierdzeniem.</p>
  `;

  return EmailTemplate({
    preheader: isReschedule
      ? `Propozycja nowego terminu wizyty: ${formattedDate} o ${formattedTime}`
      : `Twoja rezerwacja na ${formattedDate} o ${formattedTime} została przyjęta`,
    title: isReschedule
      ? "Propozycja nowego terminu wizyty"
      : "Potwierdzenie otrzymania rezerwacji",
    content: emailContent,
  });
};

export async function createSubmissionAction(
  data: SubmissionFullSchema,
  options: Options = {}
) {
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
      status: options?.isReschedule ? "AWAITING_USER_CONFIRMATION" : "PENDING",
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

  if (options.blockSendingEmail) {
    return submission.id;
  }

  // Send email to client about the submission
  try {
    const emailTemplate = generateSubmissionEmailTemplate(
      submission,
      !!options.isReschedule
    );
    await sendEmail({
      from: process.env.NEXT_PUBLIC_EMAIL || "noreply@salon-pati.pl",
      to: email,
      subject: "Potwierdzenie rezerwacji - Salon Kosmetyczny Pati",
      text: `Twoja rezerwacja na ${formatDate(
        startDate
      )} o ${startTime} została przyjęta i oczekuje na potwierdzenie.`,
      html: emailTemplate,
    });

    // Send notification email to salon
    await sendEmail({
      from: process.env.NEXT_PUBLIC_EMAIL || "noreply@salon-pati.pl",
      // No "to" parameter - it will use the default NEXT_PUBLIC_EMAIL from env
      subject: options?.isReschedule
        ? `[ADMIN] Nowa propozycja zmiany terminu: ${name} ${surname}`
        : `[ADMIN] Nowa rezerwacja: ${name} ${surname}`,
      text: `Nowa ${
        options?.isReschedule ? "propozycja zmiany terminu" : "rezerwacja"
      } od ${name} ${surname} na ${formatDate(startDate)} o ${startTime}.`,
      html: `
        <p>Nowa ${
          options?.isReschedule ? "propozycja zmiany terminu" : "rezerwacja"
        } wymaga Twojej uwagi:</p>
        <p><strong>Klient:</strong> ${name} ${surname}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Telefon:</strong> ${phone}<br>
        <strong>Data:</strong> ${formatDate(startDate)}<br>
        <strong>Godzina:</strong> ${startTime}<br>
        <strong>Czas trwania:</strong> ${duration} minut</p>
        <p>Zaloguj się do panelu administracyjnego, aby ${
          options?.isReschedule
            ? "potwierdzić zmianę terminu"
            : "potwierdzić lub odrzucić rezerwację"
        }.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    // We don't throw here to avoid rolling back the submission creation if email fails
  }

  return submission.id;
}
