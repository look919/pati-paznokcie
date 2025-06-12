import dayjs from "dayjs";

export const DATE_FORMAT = "DD/MM/YYYY";
export const TIME_FORMAT = "HH:mm";
export const DATE_AND_TIME_FORMAT = "DD/MM/YYYY HH:mm";

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

export const getAvailableTimes = (duration: number) => {
  return [
    "9:00",
    "9:15",
    "9:30",
    "9:45",
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
    // "13:30",
    // "13:45",
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
  ].filter((time) => {
    // Parse the time strings into minutes since start of day for easier comparison
    const [hours, minutes] = time.split(":").map(Number);
    const timeInMinutes = hours * 60 + minutes;

    // Parse end of day time
    const [endHours, endMinutes] = END_OF_THE_DAY.split(":").map(Number);
    const endOfDayMinutes = endHours * 60 + endMinutes;

    // Calculate if this time + duration would exceed end of day
    return timeInMinutes + duration <= endOfDayMinutes;
  });
};
