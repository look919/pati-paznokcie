import { TreatmentForm } from "../TreatmentForm";

export default function CreateTreatmentPage() {
  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 max-w-2xl mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Dodaj usługę
        </span>
      </h2>
      <TreatmentForm />
    </div>
  );
}
