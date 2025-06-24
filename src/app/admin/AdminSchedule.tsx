"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // For dateClick
import { Profile } from "@prisma/client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatTime } from "@/lib/time";
import { CreateEventDialog } from "./CreateEventConfirmationDialog";
import { useRouter } from "next/navigation";

export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    description: string;
    profile: Profile;
    treatmentsAmount: number;
  };
};

interface EventContentArg {
  event: {
    timeText: string;
    title: string;
    extendedProps: {
      id: string;
      description: string;
      profile: Profile;
      treatmentsAmount: number;
      start: Date;
      end: Date;
    };
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
  const router = useRouter();
  const [calendarView, setCalendarView] =
    useState<CalendarView>("timeGridWeek");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showWeekends, setShowWeekends] = useState(false);

  // Add custom styles for mobile time column
  useEffect(() => {
    const styleId = "calendar-custom-styles";

    // Only add styles if they don't already exist
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
        @media (max-width: 640px) {
          .fc-timegrid-axis-cushion {
            font-size: 0.7rem !important;
            width: 30px !important;
            max-width: 30px !important;
          }
          .fc-timegrid-slot-label {
            font-size: 0.7rem !important;
            width: 30px !important;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Cleanup on component unmount
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const handleViewChange = (value: string) => {
    setCalendarView(value as CalendarView);
  };

  const handleDateClick = (info: {
    date: Date;
    dateStr: string;
    allDay: boolean;
    dayEl: HTMLElement;
    jsEvent: MouseEvent;
    view: object;
  }) => {
    // Only open dialog for timeGridDay and timeGridWeek views
    if (calendarView === "timeGridDay" || calendarView === "timeGridWeek") {
      setSelectedDate(info.date);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="space-y-4 flex flex-col mb-0">
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <Tabs value={calendarView} onValueChange={handleViewChange}>
          <TabsList className="grid grid-cols-3 bg-gray-800 text-white rounded-lg">
            <TabsTrigger
              className="text-white aria-selected:text-black"
              value="timeGridDay"
            >
              Dzień
            </TabsTrigger>
            <TabsTrigger
              className="text-white aria-selected:text-black"
              value="timeGridWeek"
            >
              Tydzień
            </TabsTrigger>
            <TabsTrigger
              className="text-white aria-selected:text-black"
              value="dayGridMonth"
            >
              Miesiąc
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Switch
            id="weekend-toggle"
            checked={showWeekends}
            onCheckedChange={setShowWeekends}
          />
          <Label htmlFor="weekend-toggle" className="text-sm">
            Pokaż weekendy
          </Label>
        </div>
      </div>
      <FullCalendar
        key={`${calendarView}-${showWeekends}`}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={calendarView}
        headerToolbar={{
          left: "prev,next today",
          center: "",
          right: "title",
        }}
        weekends={showWeekends}
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
        slotDuration={{ minutes: 15 }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        allDaySlot={false}
        slotLaneClassNames="sm:w-8 md:w-12"
        height="auto"
        contentHeight="auto"
        selectable={true}
        dateClick={handleDateClick}
        eventClick={(info) => {
          // Prevent default click behavior
          info.jsEvent.preventDefault();

          router.push(`/admin/zgloszenia/${info.event.id}`);
        }}
      />

      <CreateEventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        startDate={selectedDate}
      />
    </div>
  );
};

function renderEventContent(eventInfo: EventContentArg, view: CalendarView) {
  const treatmentsAmount = eventInfo.event.extendedProps?.treatmentsAmount || 0;
  const description = eventInfo.event.extendedProps?.description || "";

  const shouldDisplayDescription =
    (view === "timeGridDay" || view === "timeGridWeek") && treatmentsAmount > 1;

  const displayTime = `${formatTime(eventInfo.event.start)} - ${formatTime(
    eventInfo.event.end
  )}`;

  switch (view) {
    case "timeGridDay":
      return (
        <>
          <b className="mr-2 text-sm md:text-md">{displayTime}</b>
          <i> {eventInfo.event.title}</i>
          <i className="text-xs mt-2">
            {shouldDisplayDescription ? <p>{description}</p> : null}
          </i>
        </>
      );
    case "timeGridWeek":
      return (
        <>
          <b className="hidden lg:block mr-1 md:mr-2 text-sm">{displayTime}</b>
          <i className="text-[9px] sm:text-xs md:text-md text-wrap">
            {eventInfo.event.title}
          </i>
          <span className="hidden lg:block text-xs mt-2">
            {shouldDisplayDescription ? <p>{description}</p> : null}
          </span>
        </>
      );
    case "dayGridMonth":
      return (
        <div className="flex items-center justify-center">
          <b className="mr-1 md:mr-2 text-[9px] sm:text-xs md:text-sm">
            {displayTime}
          </b>
          <i className="hidden 2xl:block text-md">{eventInfo.event.title}</i>
        </div>
      );

    default:
      return null;
  }
}
