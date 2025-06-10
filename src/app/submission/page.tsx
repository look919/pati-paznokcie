import { db } from "@/lib/db";
import { SubmissionForm } from "./SubmissionForm";
import { SubmissionStepper } from "./SubmissionStepper";

export default async function Submission() {
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
    <main className="flex items-center justify-center pt-16 pb-4">
      {/* <SubmissionForm treatments={treatments} /> */}
      <SubmissionStepper treatments={treatments} />
    </main>
  );
}
