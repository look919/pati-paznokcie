import { PageWrapper } from "@/components/PageWrapper";
import { acceptRescheduleResponseAction } from "@/actions/submission/rescheduleResponseAction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sendEmail } from "@/actions/sendEmailAction";
import { COMPANY_INFO } from "@/consts";

export default async function AcceptReschedule(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const searchParams: { id?: string } = await props.searchParams;
  const submissionId = searchParams?.id;

  if (!submissionId) {
    redirect("/");
  }

  try {
    await acceptRescheduleResponseAction(submissionId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message !== "Submission is not awaiting user confirmation") {
        await sendEmail({
          to: COMPANY_INFO.EMAIL,
          subject: `[ADMIN] Błąd podczas potwierdzania terminu: ${submissionId}`,
          text: `Wystąpił błąd podczas potwierdzania terminu wizyty o ID: ${submissionId}.`,
          html: `<p>Wystąpił błąd podczas potwierdzania terminu wizyty o ID: <strong>${submissionId}</strong>.</p>`,
        });
      }
    }
  }

  return (
    <PageWrapper className="md:p-0">
      <section className="py-12 px-4 md:px-6 bg-gradient-to-r min-h-[calc(100vh-100px)] from-sky-400 to-blue-500 relative">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-center text-4xl font-light text-white mb-6 uppercase tracking-wide">
            <span className="inline-block border-b-2 border-white pb-2">
              Potwierdzenie wizyty
            </span>
          </h1>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div>
            <div className="h-24 w-24 rounded-full bg-green-100 mx-auto mb-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Dziękujemy za potwierdzenie!
            </h2>
            <p className="text-lg text-gray-600 mb-3">
              Twój termin wizyty został potwierdzony.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Do zobaczenia w naszym salonie!
            </p>
            <Button asChild className="bg-rose-400 hover:bg-rose-500">
              <Link href="/">Powrót do strony głównej</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
