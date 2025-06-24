import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { AdminPageHeader } from "./AdminPageHeader";

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

type PageHeaderProps = {
  isAdmin?: boolean;
};
export const PageHeader = ({ isAdmin }: PageHeaderProps) => {
  if (!isAdmin) {
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

  return <AdminPageHeader />;
};
