"use server";
import {
  getAvailableDates,
  DATE_FORMAT,
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

  // loop trough dateAvailableTimesMap and check if there are any time blocks left
  // For each time block, check if there are enough consecutive time blocks after it to fit the treatment duration
  const filteredDateTimeMap = new Map<string, string[]>();

  dateAvailableTimesMap.forEach((timeBlocks, date) => {
    // Convert time blocks to minutes for easier comparison
    const timeBlocksInMinutes = timeBlocks.map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    });

    // Sort time blocks chronologically
    timeBlocksInMinutes.sort((a, b) => a - b);

    // Find valid starting times that can accommodate the full duration
    const validStartTimes = timeBlocks.filter((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const startTimeInMinutes = hours * 60 + minutes;

      // Calculate how many 15-minute blocks are needed for this treatment
      const requiredBlocks = Math.ceil(duration / 15);

      // Check if we can find enough consecutive blocks
      let consecutiveBlocks = 1; // Start with 1 for the current block
      let currentBlockTime = startTimeInMinutes;

      for (let i = 1; i < requiredBlocks; i++) {
        const nextBlockTime = currentBlockTime + 15;

        if (timeBlocksInMinutes.includes(nextBlockTime)) {
          consecutiveBlocks++;
          currentBlockTime = nextBlockTime;
        } else {
          break; // Found a gap, can't fit treatment here
        }
      }

      return consecutiveBlocks >= requiredBlocks;
    });

    if (validStartTimes.length > 0) {
      filteredDateTimeMap.set(date, validStartTimes);
    }
  });

  // Create allDates array from the filtered map
  const allDates = Array.from(filteredDateTimeMap.entries()).map(
    ([date, times]) => ({
      date,
      availableTimes: times,
    })
  );

  // Score each available time slot based on proximity to other bookings
  const scoredTimeSlots: Array<{ date: string; time: string; score: number }> =
    [];

  filteredDateTimeMap.forEach((availableTimes, date) => {
    availableTimes.forEach((time) => {
      // For simplicity, use time of day as score - earlier times get better scores
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Score based on time of day: earlier slots get better scores
      // And add some randomness to distribute appointments evenly
      const timeOfDayScore = timeInMinutes - 9 * 60; // Distance from 9:00 AM
      const randomFactor = Math.random() * 30; // Add some randomness (up to 30 min)

      scoredTimeSlots.push({
        date,
        time,
        score: timeOfDayScore + randomFactor,
      });
    });
  });

  // Sort by score (ascending) and date (ascending)
  scoredTimeSlots.sort((a, b) => {
    // First compare score
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    // If scores are equal, compare dates
    const dateA = dayjs(a.date, DATE_FORMAT);
    const dateB = dayjs(b.date, DATE_FORMAT);
    return dateA.diff(dateB);
  });

  // Extract top 5 preferable dates from different days
  const seenDates = new Set<string>();
  const preferableDates = [];

  for (const slot of scoredTimeSlots) {
    if (!seenDates.has(slot.date)) {
      preferableDates.push({
        date: slot.date,
        time: slot.time,
      });
      seenDates.add(slot.date);

      if (preferableDates.length >= 5) {
        break;
      }
    }
  }

  return {
    preferableDates,
    allDates,
  };
}
