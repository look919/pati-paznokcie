import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="pt-4 pb-1 px-6 relative bg-gray-800 text-gray-300 flex items-center justify-center ">
      <div className="">
        <Image
          src="/images/logo-transparent.png"
          alt="Patrycja Kuczkowska Logo"
          width={200}
          height={100}
          className="h-[100px] w-auto object-contain mx-auto"
        />
      </div>
      <p className="absolute bottom-4 right-4 text-sm text-gray-400">
        © 2025 by Tomasz Wirkus. All rights reserved.
      </p>
    </footer>
  );
};
