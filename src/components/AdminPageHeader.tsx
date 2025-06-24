import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export const AdminPageHeader = async () => {
  const openSubmissionsCount = await db.submission.count({
    where: {
      status: "PENDING",
      startDate: {
        gte: new Date(),
      },
    },
  });

  return (
    <header className="pt-4 pb-1 px-4 relative bg-gray-800 text-gray-300 h-fit sm:h-25 flex flex-col sm:flex-row items-center justify-between">
      <Link href="/">
        <Image
          src="/images/logo-transparent.png"
          alt="Patrycja Kuczkowska Logo"
          width={160}
          height={80}
          className="h-[80px] w-[160px] object-contain mx-auto"
        />
      </Link>
      <nav className="my-4 sm:mt-0">
        <ul className="flex justify-evenly space-x-6">
          <li>
            <Link href="/admin" className="text-gray-300 hover:text-white">
              Terminarz
            </Link>
          </li>
          <li>
            <Link
              href="/admin/zgloszenia?status=PENDING"
              className="text-gray-300 hover:text-white relative"
            >
              Zgłoszenia
              {openSubmissionsCount > 0 && (
                <span className="absolute -top-1.5 -right-3 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {openSubmissionsCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/klienci"
              className="text-gray-300 hover:text-white"
            >
              Klienci
            </Link>
          </li>
          <li>
            <Link
              href="/admin/uslugi"
              className="text-gray-300 hover:text-white"
            >
              Usługi
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
