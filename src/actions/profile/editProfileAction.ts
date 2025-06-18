"use server";

import { ProfileFormSchema } from "@/app/admin/klienci/stworz/CreateProfileForm";
import { db } from "@/lib/db";

export async function editProfileAction(
  profileId: string,
  data: ProfileFormSchema
) {
  try {
    // Check if the profile exists
    const profile = await db.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new Error("Profil nie został znaleziony");
    }

    // Check if another profile with this email already exists (if email was changed)
    if (data.email !== profile.email) {
      const existingProfile = await db.profile.findUnique({
        where: { email: data.email },
      });

      if (existingProfile) {
        throw new Error("Profil z tym adresem email już istnieje");
      }
    }

    // Update the profile
    const updatedProfile = await db.profile.update({
      where: { id: profileId },
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
      },
    });

    return updatedProfile.id;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
