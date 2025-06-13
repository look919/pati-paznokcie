import React from "react";
import Image from "next/image";
import { treatments } from "@/lib/treatments";

export const Services = () => {
  // Images to use for treatments
  const serviceImages = [
    "/images/about-1.jpg",
    "/images/about-2.jpg",
    "/images/about-3.jpg",
    "/images/gallery/gal-1.jpg",
    "/images/gallery/gal-2.jpg",
  ];

  return (
    <section className="bg-gradient-to-br from-sky-400 to-blue-500 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-light text-white mb-16 uppercase tracking-wide">
          <span className="inline-block border-b-2 border-white pb-2">
            Co oferuję
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
          {treatments.map((treatment, index) => (
            <div
              key={index}
              className="bg-white shadow-xl overflow-hidden rounded-lg border-6 border-slate-300"
            >
              {/* Image container with relative position for the heart icon */}
              <div className="relative h-64 w-full">
                <Image
                  src={serviceImages[index % serviceImages.length]}
                  alt={treatment.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <h5 className="bg-blue-500 text-white font-semibold text-center py-4 px-2 text-xl">
                {treatment.name}
              </h5>

              <div className="p-6 space-y-5">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0 mt-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {treatment.description}
                  </p>
                </div>

                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-500 mr-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>~{treatment.duration} min</p>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-500 mr-4"
                  >
                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-bold text-blue-700">
                    {treatment.price} zł
                  </p>
                </div>

                <button className="w-full py-3 px-4 bg-blue-500 text-white uppercase font-medium tracking-wide rounded hover:bg-blue-600 transition-colors mt-4 ">
                  Zarezerwuj termin
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
