"use client";

import { EditIcon, EyeIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { createColumn, createIndexColumn } from "@/lib/columns-utils";
import { Grid } from "@/components/ui/Grid";

type TreatmentsGridRecord = {
  id: string;
  createdAt: Date;
  name: string;
  description: string;
  price: number;
  duration: number;
  isVisible: boolean;
  submissionsCount: number;
};

const columns: ColumnDef<TreatmentsGridRecord>[] = [
  createIndexColumn(),
  createColumn("name", "Nazwa", { size: 150 }),
  createColumn("price", "Cena", {
    size: 100,
    cell: ({ row }) => {
      const price = row.original.price;
      return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
      }).format(price);
    },
  }),
  createColumn("duration", "Czas trwania (min)", { size: 150 }),
  createColumn("isVisible", "Widoczność", {
    size: 120,
    cell: ({ row }) => (row.original.isVisible ? "Publiczne" : "Prywatne"),
  }),
  createColumn("submissionsCount", "Liczba zgłoszeń", { size: 130 }),
  {
    id: "actions",
    header: "Akcje",
    size: 120,
    maxSize: 120,
    cell: ({ row }) => {
      const treatment = row.original;

      return (
        <div className="flex justify-center gap-2">
          <Link href={`/admin/uslugi/${treatment.id}`}>
            <EyeIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 hover:text-blue-800" />
          </Link>
          <Link href={`/admin/uslugi/${treatment.id}/edit`}>
            <EditIcon className="w-4 h-4 md:w-5 md:h-5 text-amber-600 hover:text-amber-800" />
          </Link>
        </div>
      );
    },
  },
];

type TreatmentsGridProps = {
  data: TreatmentsGridRecord[];
  totalCount?: number;
  pageCount?: number;
};

export function TreatmentsList({
  data,
  totalCount,
  pageCount,
}: TreatmentsGridProps) {
  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/uslugi/stworz"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-full text-white 
                     bg-gradient-to-r from-sky-400 to-blue-500"
        >
          + Dodaj usługę
        </Link>
      </div>

      <Grid
        columns={columns}
        data={data}
        defaultPageSize={25}
        totalCount={totalCount}
        pageCount={pageCount}
        manualPagination={!!pageCount}
      />
    </div>
  );
}
