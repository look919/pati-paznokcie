import { db } from "@/lib/db";
import { EventForm } from "./EventForm";

export default async function CreateEventPage() {
  const treatments = await db.treatment.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  });

  const profiles = await db.profile.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 max-w-2xl mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Dodaj wydarzenie
        </span>
      </h2>
      <EventForm treatments={treatments} profiles={profiles} />
    </div>
  );
}
