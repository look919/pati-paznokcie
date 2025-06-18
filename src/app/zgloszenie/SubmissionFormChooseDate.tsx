"use client";
import { AvailableDates } from "@/actions/submission/findTreatmentDateAction";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/lib/time";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmissionFormBasicDataSchema } from "./SubmissionFormBasicData";
import { toast } from "sonner";
import { createSubmissionAction } from "@/actions/submission/createSubmissionAction";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { SubmissionFormState } from "./SubmissionForm";

dayjs.extend(customParseFormat);

type SubmissionStepperChooseDateProps = {
  availableDates: AvailableDates;
  basicForm: UseFormReturn<SubmissionFormBasicDataSchema>;
  setSubmissionFormState: (state: SubmissionFormState) => void;
};

const submissionFormChooseDateSchema = z.object({
  date: z.date().min(new Date(), "Wybierz datę zabiegu"),
  startTime: z.string().min(1, "Wybierz godzinę rozpoczęcia zabiegu"),
});
export type SubmissionFormChooseDateSchema = z.infer<
  typeof submissionFormChooseDateSchema
>;

export const SubmissionFormChooseDate = ({
  availableDates,
  basicForm,
  setSubmissionFormState,
}: SubmissionStepperChooseDateProps) => {
  const form = useForm<SubmissionFormChooseDateSchema>({
    resolver: zodResolver(submissionFormChooseDateSchema),
    defaultValues: {
      startTime: "",
    },
  });

  const [shouldDisplayCalendar, setShouldDisplayCalendar] = useState(false);
  const selectedDate = form.watch("date");

  const handleSubmitForm = async (data: SubmissionFormChooseDateSchema) => {
    try {
      const createdSubmissionId = await createSubmissionAction({
        ...basicForm.getValues(),
        startTime: data.startTime,
        date: data.date,
      });

      if (!createdSubmissionId) {
        toast.error("Nie udało się zarezerwować terminu, spróbuj ponownie.");
      }
      form.reset();
      basicForm.reset();
      setSubmissionFormState("SUCCESS");
    } catch {
      toast.error(
        "Wystąpił błąd podczas zapisywania daty, spróbuj ponownie później."
      );
    }
  };

  const selectedDateTimeBlocks = availableDates.allDates.find(
    (d) => d.date === dayjs(selectedDate).format(DATE_FORMAT)
  )?.availableTimes;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-4 h-full"
      >
        <p className="text-lg mb-2 text-white/90">
          Znaleźliśmy dla ciebie odpowiednie terminy!
        </p>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-white">
                Wybierz datę zabiegu:
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {availableDates.preferableDates.map((preferableDate) => (
                    <div
                      key={preferableDate.date}
                      className={cn(
                        "border rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-all duration-300",
                        field.value &&
                          dayjs(preferableDate.date, DATE_FORMAT).isSame(
                            field.value,
                            "day"
                          )
                          ? "bg-white/30 border-white"
                          : "border-white/40"
                      )}
                      onClick={() => {
                        form.setValue(
                          "date",
                          dayjs(preferableDate.date, DATE_FORMAT).toDate()
                        );
                        form.setValue("startTime", preferableDate.time);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <CalendarIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {preferableDate.date}
                          </div>
                          <div className="text-sm text-white/80">
                            Godzina: {preferableDate.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-white/80" />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="outline"
          className="bg-white/20 border-white/40 hover:bg-white/30 text-white mt-2"
          onClick={() => setShouldDisplayCalendar(!shouldDisplayCalendar)}
        >
          {shouldDisplayCalendar ? "Ukryj kalendarz" : "Wybierz inną datę"}
        </Button>
        {shouldDisplayCalendar && (
          <>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Wybierz datę</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-white/20 border-white/40 hover:bg-white/30 text-white",
                            !field.value && "text-white/70"
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
                        disabled={(date) => {
                          // Disable dates that are not in the availableDates
                          // or are outside the range of 1 week to 3 months
                          if (
                            date < dayjs().add(1, "week").toDate() ||
                            date > dayjs().add(3, "month").toDate() ||
                            !availableDates.allDates.some(
                              (d) => d.date === dayjs(date).format(DATE_FORMAT)
                            )
                          ) {
                            return true;
                          }

                          // If the date is in the availableDates, allow selection
                          return false;
                        }}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage className="text-white/80" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Wybierz godzinę</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={
                      !selectedDateTimeBlocks ||
                      selectedDateTimeBlocks.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/20 border-white/40 text-white w-full">
                        <SelectValue placeholder="Wybierz godzinę" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedDateTimeBlocks?.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-white/80" />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="flex-grow mt-4"></div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-white text-blue-600 hover:bg-white/90 transition-all duration-300"
        >
          Rezerwuj termin
        </Button>
      </form>
    </Form>
  );
};
