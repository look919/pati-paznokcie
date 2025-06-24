import { ProfilesList } from "./ProfilesList";
import { db } from "@/lib/db";

const getAllProfiles = async () => {
  const profiles = await db.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submissions: true,
    },
  });

  return profiles.map((profile) => ({
    id: profile.id,
    createdAt: profile.createdAt,
    name: profile.name,
    surname: profile.surname,
    email: profile.email,
    phone: profile.phone,
    submissionsCount: profile.submissions.length,
  }));
};

export default async function ProfilesPage() {
  const profiles = await getAllProfiles();

  return (
    <div className="flex flex-col items-center min-h-screen p-2 md:p-4 mx-auto max-w-[1260px] 2xl:max-w-fit">
      <h2 className="text-center text-2xl md:text-4xl font-light text-black mb-6 md:mb-10 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Klienci
        </span>
      </h2>
      <ProfilesList data={profiles} />
    </div>
  );
}
