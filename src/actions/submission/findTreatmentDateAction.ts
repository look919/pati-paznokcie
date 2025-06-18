"use server";
import {
  getAvailableDates,
  DATE_FORMAT,
  TIME_FORMAT,
  getAvailableTimesBasedOnTreatmentDuration,
} from "@/lib/time";
import { db } from "@/lib/db";
import dayjs from "dayjs";
import { Status } from "@prisma/client";

export type AvailableDates = {
  preferableDates: {
    date: string;
    time: string;
  }[];
  allDates: {
    date: string;
    availableTimes: string[];
  }[];
};

export async function findTreatmentDateAction(
  duration: number
): Promise<AvailableDates> {
  const allAcceptedSubmissions = await db.submission.findMany({
    where: {
      status: Status.ACCEPTED,
      startDate: {
        gte: dayjs().startOf("day").toDate(), // Only consider future dates
      },
    },
    select: {
      startDate: true,
      endDate: true,
      timeBlocks: true,
    },
  });
  const availableDates = getAvailableDates();
  const availableTimesByTreatmentDuration =
    getAvailableTimesBasedOnTreatmentDuration(duration);

  // Map to store date -> available times blocks
  const dateAvailableTimesMap = new Map<string, string[]>();
  // Fill dateAvailableTimesMap with availableTimesByTreatmentDuration
  availableDates.forEach((date) => {
    dateAvailableTimesMap.set(date, [...availableTimesByTreatmentDuration]);
  });

  // Loop through all accepted submissions and remove occupied time blocks
  allAcceptedSubmissions.forEach((submission) => {
    const formattedDate = dayjs(submission.startDate).format(DATE_FORMAT);
    const occupiedTimeBlocks = submission.timeBlocks;

    // If the date is in the map, filter out the occupied time blocks
    if (dateAvailableTimesMap.has(formattedDate)) {
      const availableTimeBlocks = dateAvailableTimesMap.get(formattedDate)!;
      dateAvailableTimesMap.set(
        formattedDate,
        availableTimeBlocks.filter((time) => !occupiedTimeBlocks.includes(time))
      );
    }
  });

  // Let's simplify the approach by processing each date independently
  const filteredDateTimeMap = new Map<string, string[]>();

  // Process each date separately
  for (const date of availableDates) {
    // Get all accepted bookings for this date
    const bookingsForDate = allAcceptedSubmissions.filter(
      (submission) => dayjs(submission.startDate).format(DATE_FORMAT) === date
    );

    // Collect all occupied time slots for this date
    const occupiedSlots = new Set<string>();
    bookingsForDate.forEach((booking) => {
      booking.timeBlocks.forEach((timeSlot) => {
        occupiedSlots.add(timeSlot);
      });
    });

    // Start with all slots that can accommodate the treatment duration
    const potentialStartTimes =
      getAvailableTimesBasedOnTreatmentDuration(duration);

    // Filter out any start times where any required time slot is already occupied
    const validStartTimes = potentialStartTimes.filter((startTime) => {
      // Calculate all the time slots needed for this treatment
      const requiredSlots = [];

      // Create a reference date to work with the time
      const refDate = dayjs().format("YYYY-MM-DD");

      // Create a dayjs object for the start time
      let timeSlotDayjs = dayjs(`${refDate} ${startTime}`);

      // Calculate number of 15-min blocks needed
      const requiredBlocks = Math.ceil(duration / 15);

      // Generate all required time slots
      for (let i = 0; i < requiredBlocks; i++) {
        // Format the current time slot using TIME_FORMAT from time.ts
        const timeSlot = timeSlotDayjs.format(TIME_FORMAT);
        requiredSlots.push(timeSlot);

        // Add 15 minutes for the next slot
        timeSlotDayjs = timeSlotDayjs.add(15, "minute");
      }

      // Check if any of the required slots are occupied
      return !requiredSlots.some((slot) => occupiedSlots.has(slot));
    });

    // Only add this date if it has valid times available
    if (validStartTimes.length > 0) {
      filteredDateTimeMap.set(date, validStartTimes);
    }
  }

  // Create allDates array from the filtered map
  const allDates = Array.from(filteredDateTimeMap.entries()).map(
    ([date, times]) => ({
      date,
      availableTimes: times,
    })
  );

  // Prepare data structure for selecting preferableDates
  const dateToEarliestTimes = new Map<string, string[]>();

  filteredDateTimeMap.forEach((availableTimes, date) => {
    // Create a reference date to work with times
    const refDate = dayjs().format("YYYY-MM-DD");

    // Sort times for each date by earliest first using dayjs
    const sortedTimes = [...availableTimes].sort((a, b) => {
      // Create complete date-time strings and parse with dayjs
      const timeA = dayjs(`${refDate} ${a}`, `YYYY-MM-DD ${TIME_FORMAT}`);
      const timeB = dayjs(`${refDate} ${b}`, `YYYY-MM-DD ${TIME_FORMAT}`);
      return timeA.diff(timeB);
    });

    // Store the sorted times for each date
    dateToEarliestTimes.set(date, sortedTimes);
  });

  // Sort dates chronologically
  const sortedDates = Array.from(dateToEarliestTimes.keys()).sort(
    (dateA, dateB) => {
      return dayjs(dateA, DATE_FORMAT).diff(dayjs(dateB, DATE_FORMAT));
    }
  );

  // Extract preferable dates (one per day, earliest possible time, up to 6 dates)
  const preferableDates = [];

  for (const date of sortedDates) {
    const timesForDate = dateToEarliestTimes.get(date) || [];

    if (timesForDate.length > 0) {
      // Take the earliest time slot from each day
      preferableDates.push({
        date,
        time: timesForDate[0],
      });

      // Stop once we have 6 dates (each from a different day)
      if (preferableDates.length >= 6) {
        break;
      }
    }
  }

  return {
    preferableDates,
    allDates,
  };
}
