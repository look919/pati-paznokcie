import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TreatmentForm } from "../../TreatmentForm";

interface EditTreatmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTreatmentPage({
  params,
}: EditTreatmentPageProps) {
  const resolvedParams = await params;

  // Fetch the treatment by ID
  const treatment = await db.treatment.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!treatment) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 max-w-2xl mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Edytuj usługę
        </span>
      </h2>
      <TreatmentForm treatment={treatment} />
    </div>
  );
}
