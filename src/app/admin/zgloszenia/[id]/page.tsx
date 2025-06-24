import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateAndTime, formatTime } from "@/lib/time";
import { SubmissionDetailsActions } from "./SubmissionDetailsActions";

interface SubmissionPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(price);
};

// Helper function to get status badge color
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "ACCEPTED":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "REJECTED":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "AWAITING_USER_CONFIRMATION":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "RESCHEDULED":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

// Helper function to get human-readable status
const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Oczekujące";
    case "ACCEPTED":
      return "Zaakceptowane";
    case "REJECTED":
      return "Odrzucone";
    case "AWAITING_USER_CONFIRMATION":
      return "Oczekuje na decyzję klienta";
    case "RESCHEDULED":
      return "Przełożone";
    default:
      return status;
  }
};

export default async function SubmissionPage({ params }: SubmissionPageProps) {
  const resolvedParams = await params;
  // Fetch the submission by ID
  const submission = await db.submission.findUnique({
    where: { id: resolvedParams.id },
    include: {
      profile: true,
      treatments: {
        include: {
          treatment: true,
        },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  // Calculate total price
  const totalPrice = submission.treatments.reduce(
    (sum, t) => sum + t.treatment.price,
    0
  );

  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Szczegóły zgłoszenia
        </span>
      </h2>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            Zgłoszenie #{submission.id.substring(0, 8)}
          </h3>
          <Badge className={getStatusBadgeColor(submission.status)}>
            {getStatusText(submission.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-lg mb-3">Dane klienta</h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Imię i nazwisko:</span>{" "}
                {submission.name} {submission.surname}
              </div>
              <div>
                <span className="font-medium">Email:</span> {submission.email}
              </div>
              <div>
                <span className="font-medium">Telefon:</span> {submission.phone}
              </div>
              <div>
                <span className="font-medium">Profil:</span>{" "}
                <Link
                  href={`/admin/klienci/${submission.profileId}`}
                  className="text-blue-600 hover:underline"
                >
                  Zobacz profil klienta
                </Link>
              </div>
            </div>

            <h4 className="font-medium text-lg mt-6 mb-3">Szczegóły wizyty</h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Data:</span>{" "}
                {formatDate(submission.startDate)}
              </div>
              <div>
                <span className="font-medium">Godzina rozpoczęcia:</span>{" "}
                {formatTime(submission.startDate)}
              </div>
              <div>
                <span className="font-medium">Godzina zakończenia:</span>{" "}
                {formatTime(submission.endDate)}
              </div>
              <div>
                <span className="font-medium">Czas trwania:</span>{" "}
                {submission.duration} minut
              </div>
              <div>
                <span className="font-medium">Data utworzenia:</span>{" "}
                {formatDateAndTime(submission.createdAt)}
              </div>
              <div>
                <span className="font-medium">Ostatnia aktualizacja:</span>{" "}
                {formatDateAndTime(submission.updatedAt)}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-3">Wybrane usługi</h4>
            <div className="border rounded-md divide-y">
              {submission.treatments.map((treatment) => (
                <div
                  key={treatment.treatment.id}
                  className="flex justify-between items-center p-3"
                >
                  <div>
                    <div className="font-medium">
                      {treatment.treatment.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {treatment.treatment.duration} minut
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatPrice(treatment.treatment.price)}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <div className="font-medium">Razem</div>
                <div className="font-bold">{formatPrice(totalPrice)}</div>
              </div>
            </div>
            <SubmissionDetailsActions submission={submission} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-between">
        <Link href="/admin/zgloszenia">
          <Button variant="outline" className="rounded-full">
            ← Powrót do listy zgłoszeń
          </Button>
        </Link>
      </div>
    </div>
  );
}
