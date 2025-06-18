"use client";
import { ColumnDef } from "@tanstack/react-table";
import { createColumn, createIndexColumn } from "@/lib/columns-utils";
import { Grid } from "@/components/ui/Grid";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { DeleteProfileDialog } from "./DeleteProfileDialog";

type ProfilesGridRecord = {
  id: string;
  createdAt: Date;
  name: string;
  surname: string;
  email: string;
  phone: string;
  submissionsCount: number;
};

const columns: ColumnDef<ProfilesGridRecord>[] = [
  createIndexColumn(),
  createColumn("name", "Imię"),
  createColumn("surname", "Nazwisko"),
  createColumn("email", "Email"),
  createColumn("phone", "Telefon"),
  createColumn("createdAt", "Data utworzenia"),
  createColumn("submissionsCount", "Liczba wizyt/zgłoszeń", {
    maxSize: 20,
  }),
  {
    id: "actions",
    header: "Akcje",
    cell: ({ row }) => {
      const profile = row.original;

      return (
        <div className="flex justify-center gap-2">
          <Link href={`/admin/klienci/${profile.id}`}>
            <EyeIcon className="text-blue-600 hover:text-blue-800" />
          </Link>
          <Link href={`/admin/klienci/${profile.id}/edit`}>
            <EditIcon className="text-amber-600 hover:text-amber-800" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              // Using a custom event to handle delete request at the component level
              document.dispatchEvent(
                new CustomEvent("openDeleteDialog", {
                  detail: {
                    id: profile.id,
                    name: profile.name,
                    surname: profile.surname,
                  },
                })
              );
            }}
          >
            <TrashIcon className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      );
    },
    maxSize: 100,
  },
];

type ProfilesGridProps = {
  data: ProfilesGridRecord[];
};

export const ProfilesGrid = ({ data }: ProfilesGridProps) => {
  const [selectedProfile, setSelectedProfile] = useState<{
    id: string;
    name: string;
    surname: string;
  } | null>(null);

  // Add event listener for delete dialog
  useEffect(() => {
    const handleOpenDeleteDialog = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedProfile(customEvent.detail);
    };

    document.addEventListener("openDeleteDialog", handleOpenDeleteDialog);

    return () => {
      document.removeEventListener("openDeleteDialog", handleOpenDeleteDialog);
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/klienci/stworz"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-full text-white 
                     bg-gradient-to-r from-sky-400 to-blue-500"
        >
          + Dodaj klienta
        </Link>
      </div>
      <Grid data={data} columns={columns} />

      {selectedProfile && (
        <DeleteProfileDialog
          onClose={() => {
            setSelectedProfile(null);
          }}
          profileId={selectedProfile.id}
          name={selectedProfile.name}
          surname={selectedProfile.surname}
        />
      )}
    </div>
  );
};
