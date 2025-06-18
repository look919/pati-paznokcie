import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditProfileForm } from "./EditProfileForm";

interface EditProfilePageProps {
  params: {
    id: string;
  };
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  // Fetch the profile by ID
  const profile = await db.profile.findUnique({
    where: { id: params.id },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Edytuj profil klienta
        </span>
      </h2>
      <div className="w-full max-w-md">
        <EditProfileForm profile={profile} />
      </div>
    </div>
  );
}
