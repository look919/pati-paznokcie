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

import { AcceptSubmissionDialog } from "@/app/admin/zgloszenia/components/AcceptSubmissionDialog";
import { RejectSubmissionDialog } from "@/app/admin/zgloszenia/components/RejectSubmissionDialog";
import { RescheduleSubmissionDialog } from "@/app/admin/zgloszenia/components/RescheduleSubmissionDialog";
import { CancelEventDialog } from "@/app/admin/zgloszenia/components/CancelEventDialog";
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge className="text-xs whitespace-nowrap" status={status} />;
    },
    size: 100,
  },
  createColumn("startDate", "Data rozpoczęcia", { size: 120 }),
  createColumn("endDate", "Data zakończenia", { size: 120 }),
  createColumn("name", "Imię", { size: 100 }),
  createColumn("surname", "Nazwisko", { size: 100 }),
  createColumn("treatments", "Usługi", {
    maxSize: 150,
  }),
  {
    id: "actions",
    header: "Akcje",
    size: 80,
    maxSize: 80,
    cell: ({ row }) => {
      const profile = row.original;

      // View details link for all submissions
      const viewDetailsLink = (
        <Link href={`/admin/zgloszenia/${profile.id}`}>
          <EyeIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 hover:text-blue-800" />
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
          <div className="flex justify-center gap-1">
            {viewDetailsLink}
            <button onClick={handleOpenCancelEventDialog}>
              <XIcon className="w-4 h-4 md:w-5 md:h-5 text-red-600 hover:text-red-800" />
            </button>
          </div>
        );
      }

      if (row.original.status !== "PENDING") {
        return <div className="flex justify-center">{viewDetailsLink}</div>;
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
        <div className="flex justify-center gap-1">
          {viewDetailsLink}
          <button onClick={handleOpenAcceptSubmissionDialog}>
            <CheckIcon className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 hover:text-emerald-800" />
          </button>
          <button onClick={handleOpenRejectSubmissionDialog}>
            <XIcon className="w-4 h-4 md:w-5 md:h-5 text-red-600 hover:text-red-800" />
          </button>
          <button onClick={handleRescheduleSubmission}>
            <UserRoundPenIcon className="w-4 h-4 md:w-5 md:h-5 text-amber-600 hover:text-amber-800" />
          </button>
        </div>
      );
    },
  },
];

type SubmissionsGridProps = {
  status?: string;
  data: SubmissionsGridRecord[];
  totalCount?: number;
  pageCount?: number;
};

type DialogStatus =
  | "acceptSubmission"
  | "rejectSubmission"
  | "rescheduleSubmission"
  | "cancelEvent"
  | null;

export function SubmissionsList({
  data,
  status,
  totalCount,
  pageCount,
}: SubmissionsGridProps) {
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
    <div className="w-full">
      <div className="flex flex-row justify-between items-center sm:items-center gap-3 mb-4">
        <div className="flex items-center space-x-2 cursor-pointer">
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
          <Label htmlFor="columns-switch" className="text-xs sm:text-sm">
            {status === "PENDING"
              ? "Pokaż wszystkie zgłoszenia"
              : "Pokaż oczekujące zgłoszenia"}
          </Label>
        </div>
        <Link
          href="/admin/zgloszenia/stworz"
          className="inline-flex justify-center py-2 border border-transparent shadow-sm rounded-full text-white 
                     bg-gradient-to-r from-sky-400 to-blue-500 text-sm sm:text-md px-2 sm:px-4"
        >
          + Dodaj zgłoszenie
        </Link>
      </div>
      <div className="overflow-x-auto pb-4">
        <Grid
          data={data}
          columns={columns}
          defaultPageSize={25}
          totalCount={totalCount}
          pageCount={pageCount}
          manualPagination={!!pageCount}
        />
      </div>
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
