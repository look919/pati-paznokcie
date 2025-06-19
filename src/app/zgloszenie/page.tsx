import { db } from "@/lib/db";
import { PageWrapper } from "@/components/PageWrapper";
import { SubmissionForm } from "./SubmissionForm";
import { Metadata } from "next";

// TODO: Replace with your actual domain name
export const metadata: Metadata = {
  title: "Umów wizytę - Stylizacja Paznokci Patrycja Kuczkowska",
  description:
    "Zarezerwuj termin na stylizację paznokci. Manicure hybrydowy, żelowy, klasyczny. Szybka i prosta rezerwacja online!",
  keywords:
    "rezerwacja online, umówienie wizyty, termin manicure, zapisz się na paznokcie, Gdynia",
  alternates: {
    canonical: "/zgloszenie",
  },
  openGraph: {
    title: "Umów wizytę - Stylizacja Paznokci Patrycja Kuczkowska",
    description:
      "Zarezerwuj termin na stylizację paznokci. Manicure hybrydowy, żelowy, klasyczny. Szybka i prosta rezerwacja online!",
    url: "https://your-domain-name.com/zgloszenie",
  },
};

export default async function Submission() {
  const treatments = await db.treatment.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  });

  return (
    <PageWrapper>
      <section className="py-12 px-4 md:px-6 bg-gradient-to-r w-full from-sky-400 to-blue-500 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-4xl font-light text-white mb-16 uppercase tracking-wide">
            <span className="inline-block border-b-2 border-white pb-2">
              Umów wizytę
            </span>
          </h2>
          <SubmissionForm treatments={treatments} />
        </div>
      </section>
    </PageWrapper>
  );
}
