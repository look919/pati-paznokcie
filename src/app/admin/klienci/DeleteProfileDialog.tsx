import { deleteProfileAction } from "@/actions/deleteProfileAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type DeleteProfileDialogProps = {
  onClose: () => void;
  profileId: string;
  name: string;
  surname: string;
};

export const DeleteProfileDialog = (props: DeleteProfileDialogProps) => {
  const { profileId, name, surname, onClose } = props;

  const handleDeleteProfile = async () => {
    try {
      const deletedProfileId = await deleteProfileAction(profileId);

      toast.success(`Profil ${name} ${surname} został pomyślnie usunięty.`);
      location.reload(); // Reload the page to reflect changes

      return deletedProfileId;
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error(`Wystąpił błąd podczas usuwania profilu ${name} ${surname}.`);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[320px]">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Czy na pewno chcesz usunąć profil {name} {surname}?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleDeleteProfile}>
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
