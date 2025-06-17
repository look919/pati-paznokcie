import { rejectSubmissionAction } from "@/actions/rejectSubmissionAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

type RejectSubmissionDialogProps = {
  onClose: () => void;
  submissionId: string;
  name: string;
  surname: string;
};

export const RejectSubmissionDialog = (props: RejectSubmissionDialogProps) => {
  const { submissionId, name, surname, onClose } = props;
  const [comment, setComment] = useState("");

  const handleRejectSubmission = async () => {
    try {
      const acceptedSubmissionId = await rejectSubmissionAction(
        submissionId,
        comment
      );

      toast.success(
        `Zgłoszenie ${name} ${surname} zostało pomyślnie odrzucone.`
      );
      location.reload(); // Reload the page to reflect changes

      return acceptedSubmissionId;
    } catch (error) {
      console.error("Error accepting submission:", error);
      toast.error(
        `Wystąpił błąd podczas odrzucania zgłoszenia ${name} ${surname}.`
      );
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[320px] max-w-[600px] w-full bg-red-200">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Czy na pewno chcesz odrzucić zgłoszenie {name} {surname}?
          </DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Komentarz dołączony do maila odrzucenia zgłoszenia"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleRejectSubmission}
          >
            Odrzuć
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
