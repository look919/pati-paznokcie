"use client";
import { AcceptSubmissionDialog } from "../components/AcceptSubmissionDialog";
import { RejectSubmissionDialog } from "../components/RejectSubmissionDialog";
import { RescheduleSubmissionDialog } from "../components/RescheduleSubmissionDialog";
import { CancelEventDialog } from "../components/CancelEventDialog";
import { createElement, useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@prisma/client";

type SubmissionDetailsActionsProps = {
  submission: {
    id: string;
    status: Status;
    name: string;
    surname: string;
  };
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

export const SubmissionDetailsActions = ({
  submission,
}: SubmissionDetailsActionsProps) => {
  const [actionDialog, setActionDialog] = useState<DialogStatus | null>(null);

  const closedDialog = () => {
    setActionDialog(null);
  };

  return (
    <>
      {submission.status === "PENDING" && (
        <div className="mt-6 space-y-3">
          <Button
            type="submit"
            className="w-full py-2 px-4 rounded-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setActionDialog("acceptSubmission")}
          >
            Zaakceptuj
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="w-full py-2 px-4 rounded-full border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => setActionDialog("rejectSubmission")}
          >
            Odrzuć
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="w-full py-2 px-4 rounded-full border-amber-500 text-amber-500 hover:bg-amber-50"
            onClick={() => setActionDialog("rescheduleSubmission")}
          >
            Zaproponuj inny termin
          </Button>
        </div>
      )}

      {submission.status === "ACCEPTED" && (
        <div className="mt-6">
          <Button
            type="submit"
            variant="outline"
            className="w-full py-2 px-4 rounded-full border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => setActionDialog("cancelEvent")}
          >
            Anuluj wizytę
          </Button>
        </div>
      )}
      {actionDialog &&
        createElement(DialogByStatus[actionDialog], {
          submissionId: submission.id,
          name: submission.name,
          surname: submission.surname,
          onClose: closedDialog,
        })}
    </>
  );
};
