"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderProps = {
  children?: React.ReactNode;
  className?: string;
};
const Header = ({ children, className }: HeaderProps) => (
  <header
    className={cn(
      "pt-4 pb-1 px-4 relative bg-gray-800 text-gray-300 h-25 flex items-center justify-between",
      className
    )}
  >
    {children}
  </header>
);

export const PageHeader = () => {
  const pathname = usePathname();

  if (!pathname.startsWith("/admin")) {
    return (
      <Header className="justify-center">
        <Link href="/">
          <Image
            src="/images/logo-transparent.png"
            alt="Patrycja Kuczkowska Logo"
            width={160}
            height={80}
            className="h-[80px] w-auto object-contain mx-auto"
          />
        </Link>
      </Header>
    );
  }

  return (
    <header className="pt-4 pb-1 px-4 relative bg-gray-800 text-gray-300 h-25 flex items-center justify-between">
      <Link href="/">
        <Image
          src="/images/logo-transparent.png"
          alt="Patrycja Kuczkowska Logo"
          width={160}
          height={80}
          className="h-[80px] w-auto object-contain mx-auto"
        />
      </Link>
      <nav className="flex space-x-4">
        <Link href="#about" className="text-gray-300 hover:text-white">
          O mnie
        </Link>
      </nav>
    </header>
  );
};
