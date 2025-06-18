"use server";

import { db } from "@/lib/db";

export async function deleteProfileAction(profileId: string) {
  //   Check if the profile exists
  const profile = await db.profile.findUnique({
    where: { id: profileId },
  });
  if (!profile) {
    throw new Error("Profile not found");
  }
  // Get all submission IDs related to the profile
  const submissions = await db.submission.findMany({
    where: { profileId: profile.id },
    select: { id: true },
  });

  const submissionIds = submissions.map((s) => s.id);

  // Delete all related SubmissionTreatment records first
  if (submissionIds.length > 0) {
    await db.submissionTreatment.deleteMany({
      where: {
        submissionId: { in: submissionIds },
      },
    });
  }

  // Delete all submissions related to the profile
  await db.submission.deleteMany({
    where: { profileId: profile.id },
  });

  // Delete the profile
  const deletedProfile = await db.profile.delete({
    where: { id: profileId },
  });

  return deletedProfile.id;
}
