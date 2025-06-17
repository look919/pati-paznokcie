import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import dayjs from "dayjs";
import { DATE_AND_TIME_FORMAT } from "@/lib/time";
import Link from "next/link";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[320px]">
        <DialogHeader className="mb-2">
          <DialogTitle>{`Czy chcesz utworzyć nowe wydarzenie ${dayjs(
            startDate
          ).format(DATE_AND_TIME_FORMAT)}?`}</DialogTitle>
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
