import { db } from "@/lib/db";
import { TreatmentsList } from "./TreatmentsList";

const getAllTreatments = async (page = 0, limit = 25) => {
  // Convert to numbers and ensure they are valid
  const pageNum = Math.max(0, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));

  // Get total count for pagination
  const totalCount = await db.treatment.count();

  const treatments = await db.treatment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submissions: true,
    },
    skip: pageNum * limitNum,
    take: limitNum,
  });

  return {
    treatments: treatments.map((treatment) => ({
      id: treatment.id,
      createdAt: treatment.createdAt,
      name: treatment.name,
      description: treatment.description,
      price: treatment.price,
      duration: treatment.duration,
      isVisible: treatment.isVisible,
      submissionsCount: treatment.submissions.length,
    })),
    totalCount,
    pageCount: Math.ceil(totalCount / limitNum),
  };
};

interface TreatmentsPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function TreatmentsPage({
  searchParams,
}: TreatmentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 0;
  const limit = resolvedSearchParams.limit
    ? parseInt(resolvedSearchParams.limit)
    : 25;

  const { treatments, totalCount, pageCount } = await getAllTreatments(
    page,
    limit
  );

  return (
    <div className="flex flex-col items-center min-h-screen p-2 md:p-4 mx-auto max-w-[1260px] 2xl:max-w-fit">
      <h2 className="text-center text-2xl md:text-4xl font-light text-black mb-6 md:mb-10 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Usługi
        </span>
      </h2>
      <TreatmentsList
        data={treatments}
        totalCount={totalCount}
        pageCount={pageCount}
      />
    </div>
  );
}
