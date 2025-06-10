"use server";
import {
  getAvailableDates,
  DATE_AND_TIME_FORMAT,
  DATE_FORMAT,
  getAvailableTimes,
} from "@/lib/time";
import { db } from "@/lib/db";
import dayjs from "dayjs";
import { Status } from "@prisma/client";

export async function getAvailableDatesAction(duration: number) {
  const allAcceptedSubmissions = await db.submission.findMany({
    where: {
      status: Status.ACCEPTED,
      date: {
        gte: dayjs().startOf("day").toDate(), // Only consider future dates
      },
    },
    select: {
      date: true,
      startTime: true,
      endTime: true,
    },
  });
  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes(duration);
  const freeSlots = availableDates.map((date) => {
    const acceptedSubmissionsForDate = allAcceptedSubmissions.filter(
      (submission) => dayjs(submission.date).isSame(dayjs(date, DATE_FORMAT))
    );

    const freeTimes: string[] = [];

    availableTimes.forEach((time) => {
      const start = dayjs(`${date} ${time}`, DATE_AND_TIME_FORMAT);
      const end = start.add(duration, "minute");

      // If there are no accepted submissions for this date, all times are available
      if (acceptedSubmissionsForDate.length === 0) {
        freeTimes.push(time);
        return;
      }

      const overlaps = acceptedSubmissionsForDate.some((submission) => {
        const submissionStart = dayjs(
          `${submission.date} ${submission.startTime}`,
          DATE_AND_TIME_FORMAT
        );
        const submissionEnd = dayjs(
          `${submission.date} ${submission.endTime}`,
          DATE_AND_TIME_FORMAT
        );

        return (
          (start.isBefore(submissionEnd) && end.isAfter(submissionStart)) ||
          start.isSame(submissionStart) ||
          end.isSame(submissionEnd)
        );
      });

      if (!overlaps) {
        freeTimes.push(time);
      }
    });

    return {
      date,
      freeTimes,
    };
  });

  return freeSlots.filter((slot) => slot.freeTimes.length > 0);
}
