import { CreateProfileForm } from "./CreateProfileForm";

export default async function CreateProfilePage() {
  return (
    <div className="flex flex-col items-center min-h-screen md:p-4 mx-auto">
      <h2 className="text-center text-4xl font-light text-black mb-16 uppercase tracking-wide">
        <span className="inline-block border-b-2 border-black pb-2">
          Dodaj nowego klienta
        </span>
      </h2>
      <CreateProfileForm />
    </div>
  );
}
