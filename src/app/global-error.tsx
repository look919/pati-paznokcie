"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6">Ups!</h1>
            <h2 className="text-3xl font-semibold mb-4">Coś poszło nie tak</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Przepraszamy, wystąpił krytyczny błąd aplikacji.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Spróbuj ponownie
              </button>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Powrót do strony głównej
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
