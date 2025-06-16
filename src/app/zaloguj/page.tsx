import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <PageWrapper className="md:p-0">
      <section className="bg-gradient-to-r from-sky-400 to-blue-500 relative w-full h-screen">
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
          <h2 className="text-center text-4xl font-light text-white mb-16 uppercase tracking-wide">
            <span className="inline-block border-b-2 border-white pt-6 pb-2">
              Logowanko
            </span>
          </h2>
          <div className="flex justify-center items-center gap-4">
            <SignedOut>
              <SignInButton>
                <Button>Logowanie</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Rejestracja</Button>
              </SignUpButton>
            </SignedOut>
          </div>

          <SignedIn>
            <div className="flex flex-col gap-4 items-center justify-center">
              <span className="text-lg text-white">Jesteś zalogowany!</span>
              <UserButton />

              <Link href="/admin">
                <Button asChild>
                  <span>Przejdź do panelu administracyjnego</span>
                </Button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </section>
    </PageWrapper>
  );
}
