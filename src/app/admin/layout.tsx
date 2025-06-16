import { PageWrapper } from "@/components/PageWrapper";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const isAuthenticatedUserAnAdmin = user?.privateMetadata.isAdmin === true;

  if (!isAuthenticatedUserAnAdmin) {
    redirect("/zaloguj");
  }
  return (
    <PageWrapper className="md:p-0">
      <section className="py-12 px-4 md:px-6 bg-gradient-to-r bg-white relative w-full min-h-screen">
        {children}
      </section>
    </PageWrapper>
  );
}
