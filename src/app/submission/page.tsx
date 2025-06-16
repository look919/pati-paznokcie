import { db } from "@/lib/db";
import { SubmissionForm } from "./SubmissionForm";
import { PageWrapper } from "@/components/PageWrapper";

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
    <PageWrapper>
      <SubmissionForm treatments={treatments} />
    </PageWrapper>
  );
}
