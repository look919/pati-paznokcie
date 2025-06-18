import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Fetch the profile by ID with submissions
  const profile = await db.profile.findUnique({
    where: { id: params.id },
    include: {
      submissions: {
        orderBy: { startDate: "desc" },
        include: {
          treatments: {
            include: {
              treatment: true,
            },
          },
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Profil klienta
        </span>
      </h2>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Dane osobowe</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Imię i nazwisko:</span>{" "}
                {profile.name} {profile.surname}
              </div>
              <div>
                <span className="font-medium">Email:</span> {profile.email}
              </div>
              <div>
                <span className="font-medium">Telefon:</span> {profile.phone}
              </div>
              <div>
                <span className="font-medium">Utworzono:</span>{" "}
                {new Date(profile.createdAt).toLocaleDateString("pl-PL")}
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/admin/klienci/${profile.id}/edit`}>
                <Button
                  className="w-full py-3 px-8 border border-transparent shadow-sm rounded-full text-white 
                           bg-gradient-to-r from-sky-400 to-blue-500
                           hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  Edytuj profil
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Historia wizyt ({profile.submissions.length})
            </h3>
            <div className="overflow-y-auto max-h-80">
              {profile.submissions.length === 0 ? (
                <p className="text-gray-500">Brak wizyt</p>
              ) : (
                <div className="space-y-4">
                  {profile.submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="border border-gray-200 rounded-md p-3 hover:bg-gray-50"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {new Date(submission.startDate).toLocaleDateString(
                            "pl-PL"
                          )}{" "}
                          {submission.timeBlocks[0]}
                        </div>
                        <div className="text-sm py-0.5 px-2 bg-gray-100 rounded-full">
                          {submission.status}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {submission.treatments
                          .map((st) => st.treatment.name)
                          .join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/admin/zgloszenia">
                <Button
                  variant="outline"
                  className="w-full py-2 px-4 rounded-full hover:bg-gray-50"
                >
                  Zobacz wszystkie zgłoszenia
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-between">
        <Link href="/admin/klienci">
          <Button variant="outline" className="rounded-full">
            ← Powrót do listy klientów
          </Button>
        </Link>
      </div>
    </div>
  );
}
