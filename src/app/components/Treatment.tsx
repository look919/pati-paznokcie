import { Treatment as ITreatment } from "@prisma/client";

import Image from "next/image";

interface TreatmentProps {
  treatment: ITreatment;
}

export const Treatment = ({ treatment }: TreatmentProps) => {
  return (
    <div
      key={treatment.id}
      className="grid grid-rows-[240px_60px_300px] bg-white shadow-xl overflow-hidden rounded-lg border-6 border-slate-300"
    >
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={treatment.images[0]}
          alt={treatment.name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <span className="bg-blue-700 text-white font-semibold text-center py-4 px-2 text-xl">
        {treatment.name}
      </span>

      <div className="flex flex-col justify-between p-6">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-blue-500 flex-shrink-0 mr-4"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-900 text-sm sm:text-md">
            {treatment.description}
          </span>
        </div>

        <div className="mt-auto"></div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-gray-700">Cena</p>
            <p className="text-xl font-bold text-blue-600">
              {treatment.price} zł
            </p>
          </div>

          <div>
            <p className="text-gray-700">Czas</p>
            <p className="text-xl font-bold text-blue-600">
              ~{treatment.duration} minut
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
