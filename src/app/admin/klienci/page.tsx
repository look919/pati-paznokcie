import { ProfilesGrid } from "./ProfilesGrid";
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

  return <ProfilesGrid data={profiles} />;
}
