"use server";

import { db } from "@/lib/db";
import dayjs from "dayjs";
import { TIME_FORMAT } from "@/lib/time";
import { SubmissionFullSchema } from "../app/submission/SubmissionForm";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

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
      treatments: true,
      profile: true,
    },
  });

  return submission.id;
}
