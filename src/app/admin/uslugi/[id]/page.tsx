import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface TreatmentPageProps {
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

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  const resolvedParams = await params;
  const treatment = await db.treatment.findUnique({
    where: { id: resolvedParams.id },
    include: {
      submissions: {
        include: {
          submission: true,
        },
      },
    },
  });

  if (!treatment) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Szczegóły usługi
        </span>
      </h2>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{treatment.name}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-lg mb-3">Podstawowe informacje</h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nazwa:</span> {treatment.name}
              </div>
              <div>
                <span className="font-medium">Cena:</span>{" "}
                {formatPrice(treatment.price)}
              </div>
              <div>
                <span className="font-medium">Czas trwania:</span>{" "}
                {treatment.duration} minut
              </div>
              <div>
                <span className="font-medium">Liczba zgłoszeń:</span>{" "}
                {treatment.submissions.length}
              </div>
              <div className="mt-6">
                <Link href={`/admin/uslugi/${treatment.id}/edit`}>
                  <Button
                    className="w-full py-3 px-8 border border-transparent shadow-sm rounded-full text-white 
                           bg-gradient-to-r from-sky-400 to-blue-500
                           hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    Edytuj usługę
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-3">Opis</h4>
            <p className="text-gray-700">{treatment.description}</p>

            {treatment.images && treatment.images.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-lg mb-3">Zdjęcia</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {treatment.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-md overflow-hidden"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`${treatment.name} - zdjęcie ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
