import { PageWrapper } from "@/components/PageWrapper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function SubmissionLoading() {
  return (
    <PageWrapper>
      <section className="px-4 md:px-6 bg-gradient-to-r from-sky-400 to-blue-500 relative w-screen min-h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-center text-4xl font-light text-white mb-8 uppercase tracking-wide">
            <span className="inline-block border-b-2 border-white pb-2">
              Ładowanie...
            </span>
          </h2>

          <LoadingSpinner size="large" color="white" />
        </div>
      </section>
    </PageWrapper>
  );
}
