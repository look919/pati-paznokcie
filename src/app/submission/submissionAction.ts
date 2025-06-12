"use server";
import { DATE_AND_TIME_FORMAT } from "@/lib/time";

import { db } from "@/lib/db";
import dayjs from "dayjs";
import { TIME_FORMAT } from "@/lib/time";
import { SubmissionFullSchema } from "./SubmissionForm";

export async function submissionAction(data: SubmissionFullSchema) {
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
      startDate: dayjs(date, DATE_AND_TIME_FORMAT)
        .set("hour", dayjs(startTime, TIME_FORMAT).hour())
        .set("minute", dayjs(startTime, TIME_FORMAT).minute())
        .toDate(),
      endDate: dayjs(date, DATE_AND_TIME_FORMAT)
        .add(duration, "minute")
        .toDate(),
      duration,
      timeBlocks: Array.from({ length: duration / 15 }, (_, i) =>
        dayjs(startTime, TIME_FORMAT)
          .add(i * 15, "minute")
          .format(TIME_FORMAT)
      ),
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
