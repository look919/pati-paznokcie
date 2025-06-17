"use client";
import { ColumnDef } from "@tanstack/react-table";
import { createColumn, createIndexColumn } from "@/lib/columns-utils";
import { Grid } from "@/components/ui/Grid";
import { Status } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { redirect, RedirectType } from "next/navigation";

type SubmissionsGridRecord = {
  id: string;
  createdAt: Date;
  name: string;
  surname: string;
  email: string;
  phone: string;
  status: Status;
  startDate: string;
  endDate: string;
  treatmentsCount: number;
};

const columns: ColumnDef<SubmissionsGridRecord>[] = [
  createIndexColumn(),
  createColumn("status", "Status"),
  createColumn("startDate", "Data rozpoczęcia"),
  createColumn("endDate", "Data zakończenia"),
  createColumn("name", "Imię"),
  createColumn("surname", "Nazwisko"),
  createColumn("email", "Email"),
  createColumn("phone", "Telefon"),
  createColumn("createdAt", "Data utworzenia"),
  createColumn("treatmentsCount", "Liczba usług", {
    maxSize: 20,
  }),
];

type SubmissionsGridProps = {
  status?: string;
  data: SubmissionsGridRecord[];
};

export const SubmissionsGrid = ({ data, status }: SubmissionsGridProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center space-x-2 mt-4 mb-2 cursor-pointer">
        <Switch
          id="columns-switch"
          checked={status === "ALL"}
          onCheckedChange={(checked) => {
            redirect(
              `/admin/zgloszenia?status=${checked ? "ALL" : "PENDING"}`,
              RedirectType.replace
            );
          }}
        />
        <Label htmlFor="columns-switch" className="text-sm">
          {status === "ALL"
            ? "Pokaż tylko oczekujące zgłoszenia"
            : "Pokaż wszystkie zgłoszenia"}
        </Label>
      </div>
      <Grid data={data} columns={columns} />
    </div>
  );
};
