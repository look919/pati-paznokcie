import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="relative h-[95vh] bg-gradient-to-r from-sky-400 to-blue-500 clip-polygon-hero">
      <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center mix-blend-screen"></div>
      <Image
        src="/images/logo-transparent.png"
        alt="Patrycja Kuczkowska Logo"
        width={200}
        height={100}
        className="absolute top-8 left-1/2 translate-x-[-50%]  h-[100px] w-auto object-contain"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white flex flex-col items-center">
        <h1 className="uppercase">
          <span className="block text-4xl md:text-7xl font-light tracking-widest mb-6 animate-moveInLeft">
            Patrycja Kuczkowska
          </span>
          <span className="block text-xl font-bold md:tracking-[1.75rem] animate-moveInRight">
            Stylizacja paznokci
          </span>
        </h1>
        <span className="text-lg font-light mt-8 animate-moveInRight">
          ul. Wiosenna 12, 77-100 Bytów
        </span>
        <span className="text-lg font-light animate-moveInRight">
          tel. 123-456-789 email: patrycja@example.com
        </span>

        <Link
          href={"/submission"}
          className="inline-block mt-12 py-4 px-10 rounded-full bg-white text-blue-500 text-lg uppercase tracking-wide 
                      transition-all duration-200 shadow-lg 
                      hover:-translate-y-1 hover:shadow-xl hover:bg-opacity-90
                      active:translate-y-px active:shadow-md
                      animate-moveInBottom"
        >
          Zarezerwuj wizytę online
        </Link>
      </div>
    </header>
  );
};
