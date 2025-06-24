import { db } from "@/lib/db";
import { TreatmentsList } from "./TreatmentsList";

const getAllTreatments = async () => {
  const treatments = await db.treatment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submissions: true,
    },
  });

  return treatments.map((treatment) => ({
    id: treatment.id,
    createdAt: treatment.createdAt,
    name: treatment.name,
    description: treatment.description,
    price: treatment.price,
    duration: treatment.duration,
    submissionsCount: treatment.submissions.length,
  }));
};

export default async function TreatmentsPage() {
  const treatments = await getAllTreatments();

  return (
    <div className="flex flex-col items-center min-h-screen p-2 md:p-4 mx-auto max-w-[1260px] 2xl:max-w-fit">
      <h2 className="text-center text-2xl md:text-4xl font-light text-black mb-6 md:mb-10 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Usługi
        </span>
      </h2>
      <TreatmentsList data={treatments} />
    </div>
  );
}
