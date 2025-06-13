import Image from "next/image";
import { cn } from "@/lib/utils";

export const About = () => {
  const aboutImgStyles =
    "border-8 border-slate-300 rounded-sm shadow-lg overflow-hidden transform hover:scale-110 hover:z-20 hover:outline-sky-400 hover:outline-offset-8 transition-all duration-200";

  return (
    <section className="py-24 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-4xl font-light text-gray-700 mb-20 uppercase tracking-wide">
          <span className="inline-block border-b-2 border-sky-400 pb-2">
            Exciting tours for adventurous people
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-xl font-bold text-gray-700 uppercase mb-4">
              You&apos;re going to fall in love with nature
            </h3>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
              ipsum sapiente aspernatur libero repellat quis consequatur ducimus
              quam nisi exercitationem omnis earum qui.
            </p>

            <h3 className="text-xl font-bold text-gray-700 uppercase mb-4">
              Live adventures like you never have before
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Asperiores nulla deserunt voluptatum nam. Quos vitae, dolore
              quibusdam voluptatem.
            </p>
          </div>

          <div className="relative">
            <div className="composition relative h-96">
              <div
                className={cn(
                  "absolute w-60 h-40 top-0 left-0 z-10",
                  aboutImgStyles
                )}
              >
                <Image
                  src="/images/about-1.jpg"
                  alt="Photo 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className={cn(
                  "absolute w-60 h-40 top-5 right-0 z-10",
                  aboutImgStyles
                )}
              >
                <Image
                  src="/images/about-2.jpg"
                  alt="Photo 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className={cn(
                  "absolute w-60 h-40 bottom-0 left-1/4 z-10",
                  aboutImgStyles
                )}
              >
                <Image
                  src="/images/about-3.jpg"
                  alt="Photo 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
