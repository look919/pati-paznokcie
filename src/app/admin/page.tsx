import { PageWrapper } from "@/components/PageWrapper";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminHome() {
  const user = await currentUser();
  const isAuthenticatedUserAnAdmin = user?.privateMetadata.isAdmin === true;

  if (!isAuthenticatedUserAnAdmin) {
    redirect("/zaloguj");
  }

  return (
    <PageWrapper>
      <section className="py-12 px-4 md:px-6 bg-gradient-to-r from-sky-400 to-blue-500 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-4xl font-light text-white mb-16 uppercase tracking-wide">
            <span className="inline-block border-b-2 border-white pb-2">
              Admin home
            </span>
          </h2>
        </div>
      </section>
    </PageWrapper>
  );
}
