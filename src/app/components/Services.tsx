import { Treatment } from "./Treatment";
import { db } from "@/lib/db";

export const Services = async () => {
  const treatments = await db.treatment.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="bg-gradient-to-br from-sky-400 to-blue-500 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-light text-white mb-16 uppercase tracking-wide">
          <span className="inline-block border-b-2 border-white pb-2">
            Co oferuję
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {treatments.map((treatment, index) => (
            <Treatment key={index} treatment={treatment} />
          ))}
        </div>
      </div>
    </section>
  );
};
