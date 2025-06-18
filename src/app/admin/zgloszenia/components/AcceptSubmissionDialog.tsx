import { acceptSubmissionAction } from "@/actions/submission/acceptSubmissionAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type AcceptSubmissionDialogProps = {
  onClose: () => void;
  submissionId: string;
  name: string;
  surname: string;
};

export const AcceptSubmissionDialog = (props: AcceptSubmissionDialogProps) => {
  const { submissionId, name, surname, onClose } = props;

  const handleAcceptSubmission = async () => {
    try {
      const acceptedSubmissionId = await acceptSubmissionAction(submissionId);

      toast.success(
        `Zgłoszenie ${name} ${surname} zostało pomyślnie zaakceptowane.`
      );
      location.reload(); // Reload the page to reflect changes

      return acceptedSubmissionId;
    } catch (error) {
      console.error("Error accepting submission:", error);
      toast.error(
        `Wystąpił błąd podczas akceptowania zgłoszenia ${name} ${surname}.`
      );
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[320px] max-w-[600px] w-full bg-emerald-100">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Czy na pewno chcesz zaakceptować zgłoszenie {name} {surname}?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            variant="default"
            className="bg-emerald-400 hover:bg-emerald-500 text-white"
            onClick={handleAcceptSubmission}
          >
            Zaakceptuj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
