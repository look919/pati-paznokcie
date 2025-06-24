import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDateAndTime } from "@/lib/time";

type CreateEventDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
};

export function CreateEventDialog({
  isOpen,
  onClose,
  startDate,
}: CreateEventDialogProps) {
  if (!startDate) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[320px]">
        <DialogHeader className="mb-2">
          <DialogTitle>{`Czy chcesz utworzyć nowe wydarzenie ${formatDateAndTime(
            startDate
          )}?`}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Link
            href={`/admin/zgloszenia/stworz?startDate=${startDate?.toISOString()}`}
          >
            <Button className="w-full">Utwórz wydarzenie</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
