"use client";

import { redirect, RedirectType } from "next/navigation";
import { CheckIcon, EyeIcon, UserRoundPenIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { createColumn, createIndexColumn } from "@/lib/columns-utils";
import { Grid } from "@/components/ui/Grid";
import { Status } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { AcceptSubmissionDialog } from "@/components/submission/AcceptSubmissionDialog";
import { RejectSubmissionDialog } from "@/components/submission/RejectSubmissionDialog";
import { RescheduleSubmissionDialog } from "@/components/submission/RescheduleSubmissionDialog";
import { CancelEventDialog } from "@/components/submission/CancelEventDialog";

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
  treatments: string;
};

const columns: ColumnDef<SubmissionsGridRecord>[] = [
  createIndexColumn(),
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <Link
          href={`/admin/zgloszenia/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          #{row.original.id.substring(0, 8)}
        </Link>
      );
    },
  },
  createColumn("status", "Status"),
  createColumn("startDate", "Data rozpoczęcia"),
  createColumn("endDate", "Data zakończenia"),
  createColumn("name", "Imię"),
  createColumn("surname", "Nazwisko"),
  createColumn("email", "Email"),
  createColumn("phone", "Telefon"),
  createColumn("createdAt", "Data utworzenia"),
  createColumn("treatments", "Usługi", {
    maxSize: 20,
  }),
  {
    id: "actions",
    header: "Akcje",
    maxSize: 100,

    cell: ({ row }) => {
      const profile = row.original;

      // View details link for all submissions
      const viewDetailsLink = (
        <Link href={`/admin/zgloszenia/${profile.id}`}>
          <EyeIcon className="text-blue-600 hover:text-blue-800" />
        </Link>
      );

      if (row.original.status === "ACCEPTED") {
        const handleOpenCancelEventDialog = (
          e: React.MouseEvent<HTMLButtonElement>
        ) => {
          e.preventDefault();
          document.dispatchEvent(
            new CustomEvent("openCancelDialog", {
              detail: {
                id: profile.id,
                name: profile.name,
                surname: profile.surname,
                dialog: "cancelEvent",
              },
            })
          );
        };
        return (
          <div className="flex justify-center gap-2">
            {viewDetailsLink}
            <button onClick={handleOpenCancelEventDialog}>
              <XIcon className="text-red-600 hover:text-red-800" />
            </button>
          </div>
        );
      }

      if (row.original.status !== "PENDING") {
        return (
          <div className="flex justify-center gap-2">{viewDetailsLink}</div>
        );
      }

      const handleOpenAcceptSubmissionDialog = (
        e: React.MouseEvent<HTMLButtonElement>
      ) => {
        e.preventDefault();
        document.dispatchEvent(
          new CustomEvent("openAcceptDialog", {
            detail: {
              id: profile.id,
              name: profile.name,
              surname: profile.surname,
              dialog: "acceptSubmission",
            },
          })
        );
      };

      const handleOpenRejectSubmissionDialog = (
        e: React.MouseEvent<HTMLButtonElement>
      ) => {
        e.preventDefault();
        document.dispatchEvent(
          new CustomEvent("openRejectDialog", {
            detail: {
              id: profile.id,
              name: profile.name,
              surname: profile.surname,
              dialog: "rejectSubmission",
            },
          })
        );
      };

      const handleRescheduleSubmission = (
        e: React.MouseEvent<HTMLButtonElement>
      ) => {
        e.preventDefault();
        document.dispatchEvent(
          new CustomEvent("openRescheduleDialog", {
            detail: {
              id: profile.id,
              name: profile.name,
              surname: profile.surname,
              dialog: "rescheduleSubmission",
            },
          })
        );
      };

      return (
        <div className="flex justify-center gap-2">
          {viewDetailsLink}
          <button onClick={handleOpenAcceptSubmissionDialog}>
            <CheckIcon className="text-emerald-600 hover:text-emerald-800" />
          </button>
          <button onClick={handleOpenRejectSubmissionDialog}>
            <XIcon className="text-red-600 hover:text-red-800" />
          </button>
          <button onClick={handleRescheduleSubmission}>
            <UserRoundPenIcon className="text-amber-600 hover:text-amber-800" />
          </button>
        </div>
      );
    },
  },
];

type SubmissionsGridProps = {
  status?: string;
  data: SubmissionsGridRecord[];
};

type DialogStatus =
  | "acceptSubmission"
  | "rejectSubmission"
  | "rescheduleSubmission"
  | "cancelEvent"
  | null;

export function SubmissionsList({ data, status }: SubmissionsGridProps) {
  const [dialogState, setDialogState] = useState({
    type: null as DialogStatus,
    submissionId: "",
    name: "",
    surname: "",
  });

  const closeDialog = () => {
    setDialogState({
      type: null,
      submissionId: "",
      name: "",
      surname: "",
    });
  };

  useEffect(() => {
    const handleOpenDialog = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, name, surname, dialog } = customEvent.detail;

      setDialogState({
        type: dialog,
        submissionId: id,
        name,
        surname,
      });
    };

    // Define all dialog event types
    const dialogEventTypes = [
      "openAcceptDialog",
      "openRejectDialog",
      "openRescheduleDialog",
      "openCancelDialog",
    ];

    // Add all event listeners
    dialogEventTypes.forEach((eventType) => {
      document.addEventListener(eventType, handleOpenDialog);
    });

    // Remove all event listeners on cleanup
    return () => {
      dialogEventTypes.forEach((eventType) => {
        document.removeEventListener(eventType, handleOpenDialog);
      });
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/zgloszenia/stworz"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-full text-white 
                     bg-gradient-to-r from-sky-400 to-blue-500"
        >
          + Dodaj zgłoszenie
        </Link>
      </div>
      <div className="flex items-center space-x-2 mt-4 mb-2 cursor-pointer">
        <Switch
          id="columns-switch"
          checked={status === "PENDING"}
          onCheckedChange={(checked) => {
            redirect(
              `/admin/zgloszenia?status=${checked ? "PENDING" : "ALL"}`,
              RedirectType.replace
            );
          }}
        />
        <Label htmlFor="columns-switch" className="text-sm">
          {status === "PENDING"
            ? "Pokaż wszystkie zgłoszenia"
            : "Pokaż tylko oczekujące zgłoszenia"}
        </Label>
      </div>
      <Grid data={data} columns={columns} />
      {dialogState.type === "acceptSubmission" && (
        <AcceptSubmissionDialog
          submissionId={dialogState.submissionId}
          name={dialogState.name}
          surname={dialogState.surname}
          onClose={closeDialog}
        />
      )}
      {dialogState.type === "rejectSubmission" && (
        <RejectSubmissionDialog
          submissionId={dialogState.submissionId}
          name={dialogState.name}
          surname={dialogState.surname}
          onClose={closeDialog}
        />
      )}
      {dialogState.type === "rescheduleSubmission" && (
        <RescheduleSubmissionDialog
          submissionId={dialogState.submissionId}
          name={dialogState.name}
          surname={dialogState.surname}
          onClose={closeDialog}
        />
      )}
      {dialogState.type === "cancelEvent" && (
        <CancelEventDialog
          submissionId={dialogState.submissionId}
          name={dialogState.name}
          surname={dialogState.surname}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
