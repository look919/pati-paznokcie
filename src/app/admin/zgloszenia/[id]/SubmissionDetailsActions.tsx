"use client";
import { AcceptSubmissionDialog } from "@/components/submission/AcceptSubmissionDialog";
import { RejectSubmissionDialog } from "@/components/submission/RejectSubmissionDialog";
import { RescheduleSubmissionDialog } from "@/components/submission/RescheduleSubmissionDialog";
import { CancelEventDialog } from "@/components/submission/CancelEventDialog";
import { useState } from "react";
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
      {actionDialog === "acceptSubmission" && (
        <AcceptSubmissionDialog
          submissionId={submission.id}
          name={submission.name}
          surname={submission.surname}
          onClose={closedDialog}
        />
      )}
      {actionDialog === "rejectSubmission" && (
        <RejectSubmissionDialog
          submissionId={submission.id}
          name={submission.name}
          surname={submission.surname}
          onClose={closedDialog}
        />
      )}
      {actionDialog === "rescheduleSubmission" && (
        <RescheduleSubmissionDialog
          submissionId={submission.id}
          name={submission.name}
          surname={submission.surname}
          onClose={closedDialog}
        />
      )}
      {actionDialog === "cancelEvent" && (
        <CancelEventDialog
          submissionId={submission.id}
          name={submission.name}
          surname={submission.surname}
          onClose={closedDialog}
        />
      )}
    </>
  );
};
