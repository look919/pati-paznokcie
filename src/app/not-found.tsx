import Link from "next/link";
import { PageWrapper } from "@/components/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
          <h2 className="text-3xl font-semibold mb-4">
            Ups! Strona nie znaleziona
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Przepraszamy, nie mogliśmy znaleźć strony, której szukasz.
          </p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
