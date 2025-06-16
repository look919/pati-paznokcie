import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export const AdminPopup = async () => {
  const user = await currentUser();

  const isAuthenticatedUserAnAdmin = user?.privateMetadata.isAdmin === true;

  if (!isAuthenticatedUserAnAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="fixed rounded-full bottom-2 right-2 md:bottom-4 md:right-4 bg-gray-800 text-white p-4 shadow-lg hover:bg-gray-900 transition-colors duration-300"
    >
      Admin
    </Link>
  );
};
