"use server";

import { ProfileFormSchema } from "@/app/admin/klienci/stworz/CreateProfileForm";
import { db } from "@/lib/db";

export async function createProfileAction(data: ProfileFormSchema) {
  try {
    // Check if profile with this email already exists
    const existingProfile = await db.profile.findUnique({
      where: { email: data.email },
    });

    if (existingProfile) {
      throw new Error("Profil z tym adresem email już istnieje");
    }

    // Create new profile
    const newProfile = await db.profile.create({
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
      },
    });

    return newProfile.id;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
}
