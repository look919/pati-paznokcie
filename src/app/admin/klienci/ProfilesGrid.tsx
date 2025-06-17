"use client";
import { ColumnDef } from "@tanstack/react-table";
import { createColumn, createIndexColumn } from "@/lib/columns-utils";
import { Grid } from "@/components/ui/Grid";

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
];

type ProfilesGridProps = {
  data: ProfilesGridRecord[];
};

export const ProfilesGrid = ({ data }: ProfilesGridProps) => {
  return (
    <div className="overflow-x-auto">
      <Grid data={data} columns={columns} />
    </div>
  );
};
