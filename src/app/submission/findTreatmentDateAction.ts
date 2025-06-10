"use server";
import { getAvailableDates, DATE_FORMAT, getAvailableTimes } from "@/lib/time";
import { db } from "@/lib/db";
import dayjs from "dayjs";
import { Status } from "@prisma/client";

export type FindTreatmentDateActionReturnType = {
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
): Promise<FindTreatmentDateActionReturnType> {
  const allAcceptedSubmissions = await db.submission.findMany({
    where: {
      status: Status.ACCEPTED,
      date: {
        gte: dayjs().startOf("day").toDate(), // Only consider future dates
      },
    },
    select: {
      date: true,
      timeBlocks: true,
    },
  });
  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes(duration);

  // Create a map of dates to occupied time blocks for easier lookup
  const occupiedTimeBlocksMap = new Map<string, Set<string>>();

  // Initialize the map with empty sets for each date
  availableDates.forEach((date) => {
    occupiedTimeBlocksMap.set(date, new Set<string>());
  });

  // Fill in the occupied time blocks from accepted submissions
  allAcceptedSubmissions.forEach((submission) => {
    const formattedDate = dayjs(submission.date).format(DATE_FORMAT);
    if (occupiedTimeBlocksMap.has(formattedDate)) {
      const timeBlocksSet = occupiedTimeBlocksMap.get(formattedDate)!;
      submission.timeBlocks.forEach((block) => {
        timeBlocksSet.add(block);
      });
    }
  });

  // Map to store date -> available times
  const dateAvailableTimesMap = new Map<string, string[]>();

  // For each date, calculate available time blocks
  availableDates.forEach((date) => {
    const occupiedBlocks = occupiedTimeBlocksMap.get(date) || new Set<string>();
    const availableTimeSlots = availableTimes.filter(
      (time) => !occupiedBlocks.has(time)
    );

    if (availableTimeSlots.length > 0) {
      dateAvailableTimesMap.set(date, availableTimeSlots);
    }
  });

  // Score each available time slot based on proximity to other occupied slots
  const scoredTimeSlots: Array<{ date: string; time: string; score: number }> =
    [];

  dateAvailableTimesMap.forEach((availableTimes, date) => {
    const occupiedBlocks = Array.from(
      occupiedTimeBlocksMap.get(date) || new Set<string>()
    );

    availableTimes.forEach((time) => {
      // Calculate time in minutes for easier comparison
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Calculate proximity score to other occupied blocks
      // Lower score means better fit (closer to other appointments)
      let minProximity = Number.MAX_SAFE_INTEGER;

      if (occupiedBlocks.length > 0) {
        occupiedBlocks.forEach((block) => {
          const [blockHours, blockMinutes] = block.split(":").map(Number);
          const blockTimeInMinutes = blockHours * 60 + blockMinutes;
          const proximity = Math.abs(timeInMinutes - blockTimeInMinutes);
          minProximity = Math.min(minProximity, proximity);
        });
      } else {
        // If no occupied blocks for this date, use a default score
        // Favor morning slots slightly
        minProximity = timeInMinutes - 9 * 60; // Distance from 9:00 AM
      }

      scoredTimeSlots.push({
        date,
        time,
        score: minProximity,
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

  // Prepare all dates with their available times (including preferable dates)
  const allDates = Array.from(dateAvailableTimesMap.entries()).map(
    ([date, times]) => ({
      date,
      availableTimes: times,
    })
  );

  return {
    preferableDates,
    allDates,
  };
}
