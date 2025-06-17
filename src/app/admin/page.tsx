import { db } from "@/lib/db";
import { AdminSchedule } from "./AdminSchedule";
import type { Event } from "./AdminSchedule";

const getAllEvents = async (): Promise<Event[]> => {
  const acceptedSubmissions = await db.submission.findMany({
    where: {
      status: "ACCEPTED",
    },
    include: {
      profile: true,
      treatments: {
        include: {
          treatment: true,
        },
      },
    },
  });

  const events: Event[] = acceptedSubmissions.map((submission) => ({
    title:
      submission.treatments.length === 1
        ? `${submission.profile.name} ${submission.profile.surname} - ${submission.treatments[0].treatment.name}`
        : `${submission.profile.name} ${submission.profile.surname} - ${submission.treatments.length} usługi`,
    start: submission.startDate,
    end: submission.endDate,
    description: submission.treatments.map((t) => t.treatment.name).join(", "),
    profile: submission.profile,
    treatmentsAmount: submission.treatments.length,
  }));

  return events;
};

export default async function AdminHome() {
  const events = await getAllEvents();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:p-4">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Terminarz
        </span>
      </h2>
      <AdminSchedule events={events} />
    </div>
  );
}
