"use client";

import { rescheduleSubmissionAction } from "@/actions/submission/rescheduleSubmissionAction";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  additionalCalendarTimes,
  DATE_FORMAT,
  getAvailableTimesBasedOnTreatmentDuration,
} from "@/lib/time";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverTrigger } from "@radix-ui/react-popover";
import dayjs from "@/lib/time";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type RescheduleSubmissionDialogProps = {
  onClose: () => void;
  submissionId: string;
  name: string;
  surname: string;
};

const timeOptions = getAvailableTimesBasedOnTreatmentDuration(0).concat(
  additionalCalendarTimes
);

const rescheduleFormSchema = z.object({
  newDate: z.date().min(new Date(), { message: "Data musi być w przyszłości" }),
  newTime: z.string().min(1, { message: "Czas jest wymagany" }),
  comment: z.string().max(500).optional(),
});

type RescheduleFormSchema = z.infer<typeof rescheduleFormSchema>;

export const RescheduleSubmissionDialog = (
  props: RescheduleSubmissionDialogProps
) => {
  const { submissionId, name, surname, onClose } = props;
  const form = useForm<RescheduleFormSchema>({
    resolver: zodResolver(rescheduleFormSchema),
    defaultValues: {
      newDate: new Date(),
      newTime: "",
      comment: "",
    },
  });

  const handleRescheduleSubmission = async (data: RescheduleFormSchema) => {
    try {
      const acceptedSubmissionId = await rescheduleSubmissionAction({
        submissionId,
        newDate: data.newDate,
        newTime: data.newTime,
        comment: data.comment,
      });

      toast.success(
        `Utworzono nowe zgłoszenie z propozycją terminu dla ${name} ${surname}.`
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
      <DialogContent className="min-w-[320px] max-w-[600px] w-full bg-amber-100 text-black">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Czy na pewno chcesz przełożyć zgłoszenie {name} {surname}?
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRescheduleSubmission)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="newDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Wybierz datę</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-gray/20 border-black hover:bg-white/30 text-black",
                              !field.value && "text-black/70"
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format(DATE_FORMAT)
                            ) : (
                              <span>Wybierz datę</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage className="text-black/80" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wybierz godzinę</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-black/40 text-black w-full">
                          <SelectValue placeholder="Wybierz godzinę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-black/80" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wiadomość</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Komentarz dołączony do maila przełożenia zgłoszenia"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:sky-sky-500 focus:ring-opacity-50"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Przełóż
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
