import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pl";

// Load and configure plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

export const TIMEZONE = "Europe/Warsaw";
export const DATE_FORMAT = "DD/MM/YYYY";
export const TIME_FORMAT = "HH:mm";
export const DATE_AND_TIME_FORMAT = "DD/MM/YYYY HH:mm";

dayjs.tz.setDefault(TIMEZONE);

export const formatDate = (date: Date): string => {
  // Convert UTC date to Warsaw timezone before formatting
  return dayjs.utc(date).tz(TIMEZONE).format(DATE_FORMAT);
};

export const formatTime = (time: Date | string): string => {
  if (typeof time === "string") {
    return dayjs.utc(time, TIME_FORMAT).format(TIME_FORMAT);
  }

  return dayjs.utc(time).tz(TIMEZONE).format(TIME_FORMAT);
};

export const formatDateAndTime = (date: Date): string => {
  // Convert UTC date to Warsaw timezone before formatting
  return dayjs.utc(date).tz(TIMEZONE).format(DATE_AND_TIME_FORMAT);
};

export const START_OF_THE_DAY = "09:00";
export const END_OF_THE_DAY = "17:00";

export const getAvailableDates = () => {
  const today = dayjs().add(1, "week");
  const endDate = dayjs().add(3, "month");
  const dates = [];

  let currentDate = today;
  while (currentDate.isBefore(endDate)) {
    dates.push(currentDate.format(DATE_FORMAT));
    currentDate = currentDate.add(1, "day"); // Update currentDate correctly
  }

  return dates;
};

export const getAvailableTimesBasedOnTreatmentDuration = (duration: number) => {
  const allTimes = [
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
  ];

  return allTimes.filter((time) => {
    // Parse the time strings into minutes since start of day for easier comparison
    const [hours, minutes] = time.split(":").map(Number);
    const timeInMinutes = hours * 60 + minutes;

    // Parse end of day time
    const [endHours, endMinutes] = END_OF_THE_DAY.split(":").map(Number);
    const endOfDayInMinutes = endHours * 60 + endMinutes;

    // Calculate if this time + duration would exceed end of day
    return timeInMinutes + duration <= endOfDayInMinutes;
  });
};

export const additionalCalendarTimes = [
  "06:00",
  "06:15",
  "06:30",
  "06:45",
  "07:00",
  "07:15",
  "07:30",
  "07:45",
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
];

export default dayjs;
