"use client";

import { cancelEventAction } from "@/actions/event/cancelEventAction";
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

type CancelEventDialogProps = {
  onClose: () => void;
  submissionId: string;
  name: string;
  surname: string;
};

export const CancelEventDialog = (props: CancelEventDialogProps) => {
  const { submissionId, name, surname, onClose } = props;
  const [comment, setComment] = useState("");

  const handleCancelEvent = async () => {
    try {
      const canceledEventId = await cancelEventAction(submissionId, comment);

      toast.success(`Wydarzenie ${name} ${surname} zostało anulowane.`);
      location.reload();

      return canceledEventId;
    } catch (error) {
      console.error("Error canceling event:", error);
      toast.error(
        `Wystąpił błąd podczas anulowania wydarzenia ${name} ${surname}.`
      );
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[320px] max-w-[600px] w-full bg-red-200">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Czy na pewno chcesz anulować wydarzenie {name} {surname}?
          </DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Komentarz dołączony do maila o anulowaniu wydarzenia"
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
            onClick={handleCancelEvent}
          >
            Odwołaj wydarzenie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
