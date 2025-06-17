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

  return (
    <div className="max-w-[600px] mx-auto">
      <EventForm treatments={treatments} />;
    </div>
  );
}
