import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="pt-4 pb-1 h-[120px] px-6 relative bg-gray-800 text-gray-300 flex flex-col items-center justify-center ">
      <Image
        src="/images/logo-transparent.png"
        alt="Patrycja Kuczkowska Logo"
        width={200}
        height={100}
        className="h-[100px] w-auto object-contain mx-auto"
      />
      <p className="md:absolute md:bottom-4 md:right-4 mt-2 text-xs text-gray-400">
        © 2025 by Tomasz Wirkus. All rights reserved.
      </p>
    </footer>
  );
};
