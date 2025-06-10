"use server";

import { db } from "@/lib/db";
import { SubmissionFormData } from "./SubmissionForm";
import dayjs from "dayjs";
import { TIME_FORMAT } from "@/lib/time";

export async function submissionAction(data: SubmissionFormData) {
  const { name, surname, email, phone, date, startTime, duration, treatments } =
    data;

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
      date: date,
      duration,
      startTime,
      endTime: dayjs(startTime, TIME_FORMAT)
        .add(duration, "minute")
        .format(TIME_FORMAT),
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
      treatments: true,
      profile: true,
    },
  });

  console.log("Created submission:", submission);

  return submission.id;
}
