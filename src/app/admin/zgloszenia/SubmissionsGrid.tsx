"use client";
import { ColumnDef } from "@tanstack/react-table";
import { createColumn, createIndexColumn } from "@/lib/columns-utils";
import { Grid } from "@/components/ui/Grid";
import { Status } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { redirect, RedirectType } from "next/navigation";
import { CheckIcon, UserRoundPenIcon, XIcon } from "lucide-react";
import React, { useEffect } from "react";
import { AcceptSubmissionDialog } from "./AcceptSubmissionDialog";
import { RejectSubmissionDialog } from "./RejectSubmissionDialog";
import { RescheduleSubmissionDialog } from "./RescheduleSubmissionDialog";
import { CancelEventDialog } from "./CancelEventDialog";

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
            <button onClick={handleOpenCancelEventDialog}>
              <XIcon className="text-red-600 hover:text-red-800" />
            </button>
          </div>
        );
      }

      if (row.original.status !== "PENDING") {
        return null;
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
  | "cancelEvent";

const DialogByStatus: Record<
  DialogStatus,
  (props: {
    submissionId: string;
    name: string;
    surname: string;
    onClose: () => void;
  }) => React.JSX.Element
> = {
  acceptSubmission: AcceptSubmissionDialog,
  rejectSubmission: RejectSubmissionDialog,
  rescheduleSubmission: RescheduleSubmissionDialog,
  cancelEvent: CancelEventDialog,
};

export const SubmissionsGrid = ({ data, status }: SubmissionsGridProps) => {
  const [selectedSubmission, setSelectedSubmission] = React.useState<{
    id: string;
    name: string;
    surname: string;
    dialog: DialogStatus;
  } | null>(null);

  const closedDialog = () => {
    setSelectedSubmission(null);
  };

  useEffect(() => {
    const handleOpenSubmissionDialog = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedSubmission(customEvent.detail);
    };

    document.addEventListener("openAcceptDialog", handleOpenSubmissionDialog);
    document.addEventListener("openRejectDialog", handleOpenSubmissionDialog);
    document.addEventListener(
      "openRescheduleDialog",
      handleOpenSubmissionDialog
    );
    document.addEventListener("openCancelDialog", handleOpenSubmissionDialog);

    return () => {
      document.removeEventListener(
        "openAcceptDialog",
        handleOpenSubmissionDialog
      );
      document.removeEventListener(
        "openRejectDialog",
        handleOpenSubmissionDialog
      );
      document.removeEventListener(
        "openRescheduleDialog",
        handleOpenSubmissionDialog
      );
      document.removeEventListener(
        "openCancelDialog",
        handleOpenSubmissionDialog
      );
    };
  }, []);

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
      {selectedSubmission &&
        React.createElement(DialogByStatus[selectedSubmission.dialog], {
          submissionId: selectedSubmission.id,
          name: selectedSubmission.name,
          surname: selectedSubmission.surname,
          onClose: closedDialog,
        })}
    </div>
  );
};
