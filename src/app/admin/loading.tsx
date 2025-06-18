import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminLoading() {
  return (
    <section className="py-12 px-2 md:px-6 bg-white relative w-full min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-light text-gray-700 mb-8">
          <span className="inline-block border-b-2 border-blue-500 pb-2">
            Ładowanie...
          </span>
        </h2>

        <LoadingSpinner size="large" color="blue" />
      </div>
    </section>
  );
}
