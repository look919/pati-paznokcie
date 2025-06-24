import { cn } from "@/lib/utils";
import { PageHeader } from "./PageHeader";

type PageWrapperProps = {
  children: React.ReactNode;
  className?: string;
  isAdmin?: boolean;
};
export const PageWrapper = ({
  children,
  className,
  isAdmin,
}: PageWrapperProps) => {
  return (
    <div>
      <PageHeader isAdmin={isAdmin} />
      <main
        className={cn(
          "flex flex-col items-center justify-center bg-gray-100 min-h-[calc(100vh-100px)]",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};
