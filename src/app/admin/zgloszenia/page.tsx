import { db } from "@/lib/db";
import { formatDateAndTime } from "@/lib/time";
import { SubmissionsList } from "./SubmissionsList";

const getAllSubmissions = async (status?: string, page = 0, limit = 25) => {
  // Convert to numbers and ensure they are valid
  const pageNum = Math.max(0, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));

  // Get total count for pagination
  const whereCondition =
    status === "PENDING"
      ? { status: "PENDING" as const, startDate: { gte: new Date() } }
      : { startDate: { gte: new Date() } };

  const totalCount = await db.submission.count({
    where: whereCondition,
  });

  const submissions = await db.submission.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      treatments: {
        select: {
          treatment: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    skip: pageNum * limitNum,
    take: limitNum,
  });

  return {
    submissions: submissions.map((submission) => {
      return {
        id: submission.id,
        createdAt: submission.createdAt,
        name: submission.profile?.name || "",
        surname: submission.profile?.surname || "",
        email: submission.profile?.email || "",
        phone: submission.profile?.phone || "",
        treatments:
          submission.treatments
            ?.map(
              (t: { treatment: { name: string } }) => t.treatment?.name || ""
            )
            .join(", ") || "",
        status: submission.status,
        startDate: formatDateAndTime(submission.startDate),
        endDate: formatDateAndTime(submission.endDate),
      };
    }),
    totalCount,
    pageCount: Math.ceil(totalCount / limitNum),
  };
};

type SubmissionsPageProps = {
  searchParams: Promise<{ status?: string; page?: string; limit?: string }>;
};

export default async function SubmissionsPage(props: SubmissionsPageProps) {
  const resolvedSearchParams = await props.searchParams;

  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 0;
  const limit = resolvedSearchParams.limit
    ? parseInt(resolvedSearchParams.limit)
    : 25;

  const { submissions, totalCount, pageCount } = await getAllSubmissions(
    resolvedSearchParams.status,
    page,
    limit
  );

  return (
    <div className="flex flex-col items-center min-h-screen p-2 md:p-4 mx-auto max-w-[1260px] 2xl:max-w-fit">
      <h2 className="text-center text-2xl md:text-4xl font-light text-black mb-6 md:mb-10 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Zgłoszenia
        </span>
      </h2>
      <SubmissionsList
        data={submissions}
        status={resolvedSearchParams.status}
        totalCount={totalCount}
        pageCount={pageCount}
      />
    </div>
  );
}
