import { cn } from "@/lib/utils";
import { PageHeader } from "./PageHeader";

type PageWrapperProps = {
  children: React.ReactNode;
  className?: string;
};
export const PageWrapper = ({ children, className }: PageWrapperProps) => {
  return (
    <div>
      <PageHeader />
      <main
        className={cn(
          "flex flex-col items-center justify-center bg-gray-100 min-h-[calc(100vh-100px)] md:px-4 py-8",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};
