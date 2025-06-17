import { db } from "@/lib/db";
import dayjs from "dayjs";
import { DATE_AND_TIME_FORMAT } from "@/lib/time";
import { SubmissionsGrid } from "./SubmissionsGrid";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const getAllSubmissions = async (status?: string) => {
  const submissions = await db.submission.findMany({
    where:
      status === "PENDING"
        ? { status: "PENDING", startDate: { gte: new Date() } }
        : { startDate: { gte: new Date() } },
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
  });

  return submissions.map((submission) => ({
    id: submission.id,
    createdAt: submission.createdAt,
    name: submission.profile.name,
    surname: submission.profile.surname,
    email: submission.profile.email,
    phone: submission.profile.phone,
    treatments: submission.treatments.map((t) => t.treatment.name).join(", "),
    status: submission.status,
    startDate: dayjs(submission.startDate).format(DATE_AND_TIME_FORMAT),
    endDate: dayjs(submission.endDate).format(DATE_AND_TIME_FORMAT),
  }));
};

type SubmissionsPageProps = {
  searchParams: SearchParams;
};

export default async function SubmissionsPage(props: SubmissionsPageProps) {
  const searchParams: { status?: string } = await props.searchParams;

  const submissions = await getAllSubmissions(searchParams.status);

  return (
    <div className="overflow-x-auto">
      <SubmissionsGrid data={submissions} status={searchParams.status} />
    </div>
  );
}
