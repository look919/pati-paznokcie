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
      <section className="py-12 px-4 md:px-6 bg-gradient-to-r from-sky-400 to-blue-500 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-4xl font-light text-white mb-16 uppercase tracking-wide">
            <span className="inline-block border-b-2 border-white pb-2">
              Umów wizytę
            </span>
          </h2>

          <SubmissionForm treatments={treatments} />
        </div>
      </section>
    </PageWrapper>
  );
}
