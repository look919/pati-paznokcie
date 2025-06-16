"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Profile } from "@prisma/client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";

export type Event = {
  title: string;
  start: Date;
  end: Date;
  description: string;
  profile: Profile;
  treatmentsAmount: number;
};

interface EventContentArg {
  event: {
    timeText: string;
    title: string;
    extendedProps: Pick<
      Event,
      "description" | "treatmentsAmount" | "start" | "end"
    >;
    start: Date;
    end: Date;
  };
  timeText: string;
}

interface AdminScheduleProps {
  events: Event[];
}

type CalendarView = "dayGridMonth" | "timeGridDay" | "timeGridWeek";

export const AdminSchedule = (props: AdminScheduleProps) => {
  const [calendarView, setCalendarView] =
    useState<CalendarView>("dayGridMonth");

  const handleViewChange = (value: string) => {
    setCalendarView(value as CalendarView);
  };

  return (
    <div className="space-y-4 flex flex-col mb-0">
      <Tabs
        value={calendarView}
        onValueChange={handleViewChange}
        className="w-[400px]"
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="dayGridMonth">Miesiąc</TabsTrigger>
          <TabsTrigger value="timeGridWeek">Tydzień</TabsTrigger>
          <TabsTrigger value="timeGridDay">Dzień</TabsTrigger>
        </TabsList>
      </Tabs>
      <FullCalendar
        key={calendarView}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={calendarView}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "", // We handle view switching with our custom tabs
        }}
        weekends={true}
        events={props.events}
        eventContent={(e: EventContentArg) =>
          renderEventContent(e, calendarView)
        }
        locale={"pl"}
        firstDay={1}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        height="auto"
        contentHeight="auto"
      />
    </div>
  );
};

function renderEventContent(eventInfo: EventContentArg, view: CalendarView) {
  const shouldDisplayDescription =
    (view === "timeGridDay" || view === "timeGridWeek") &&
    eventInfo.event.extendedProps.treatmentsAmount > 1;

  const displayTime = `${dayjs(eventInfo.event.start).format(
    "HH:mm"
  )} - ${dayjs(eventInfo.event.end).format("HH:mm")}`;

  return (
    <>
      <b className="mr-2">{displayTime}</b>
      <i> {eventInfo.event.title}</i>
      <i className="text-xs mt-2">
        {shouldDisplayDescription ? (
          <p>{eventInfo.event.extendedProps.description}</p>
        ) : null}
      </i>
    </>
  );
}
