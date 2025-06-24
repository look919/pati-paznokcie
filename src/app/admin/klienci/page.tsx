import { ProfilesList } from "./ProfilesList";
import { db } from "@/lib/db";

const getAllProfiles = async (page = 0, limit = 25) => {
  // Convert to numbers and ensure they are valid
  const pageNum = Math.max(0, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit))); // Cap at 100 for safety

  // Get the total count for pagination info
  const totalCount = await db.profile.count();

  // Get the paginated profiles
  const profiles = await db.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submissions: true,
    },
    skip: pageNum * limitNum,
    take: limitNum,
  });

  return {
    profiles: profiles.map((profile) => ({
      id: profile.id,
      createdAt: profile.createdAt,
      name: profile.name,
      surname: profile.surname,
      email: profile.email,
      phone: profile.phone,
      submissionsCount: profile.submissions.length,
    })),
    totalCount,
    pageCount: Math.ceil(totalCount / limitNum),
  };
};

interface ProfilesPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function ProfilesPage({
  searchParams,
}: ProfilesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 0;
  const limit = resolvedSearchParams.limit
    ? parseInt(resolvedSearchParams.limit)
    : 25;

  const { profiles, totalCount, pageCount } = await getAllProfiles(page, limit);

  return (
    <div className="flex flex-col items-center min-h-screen p-2 md:p-4 mx-auto max-w-[1260px] 2xl:max-w-fit">
      <h2 className="text-center text-2xl md:text-4xl font-light text-black mb-6 md:mb-10 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Klienci
        </span>
      </h2>
      <ProfilesList
        data={profiles}
        totalCount={totalCount}
        pageCount={pageCount}
      />
    </div>
  );
}
