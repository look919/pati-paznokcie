"use client";
import { AvailableDates } from "../../actions/findTreatmentDateAction";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
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
import { createSubmissionAction } from "@/actions/createSubmissionAction";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type SubmissionStepperChooseDateProps = {
  availableDates: AvailableDates;
  basicData: SubmissionFormBasicDataSchema;
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
  basicData,
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
        ...basicData,
        startTime: data.startTime,
        date: data.date,
      });

      if (createdSubmissionId) {
        toast.success("Termin został pomyślnie zarezerwowany!");
        // Optionally, redirect or reset the form
      } else {
        toast.error("Nie udało się zarezerwować terminu, spróbuj ponownie.");
      }
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
        className="flex flex-col gap-4"
      >
        <span className="text-lg">
          Znaleźliśmy dla ciebie odpowiednie terminy!
        </span>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Wybierz datę zabiegu:</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableDates.preferableDates.map((preferableDate) => (
                    <div
                      key={preferableDate.date}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors",
                        field.value &&
                          dayjs(preferableDate.date).isSame(field.value, "day")
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      )}
                      onClick={() => {
                        field.onChange(dayjs(preferableDate.date).toDate());
                        form.setValue("startTime", preferableDate.time);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {preferableDate.date}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Godzina: {preferableDate.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant={"link"}
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
                  <FormLabel>Wybierz datę</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            dayjs(field.value).format(DATE_FORMAT)
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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

                          if (
                            !availableDates.allDates.find(
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

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wybierz godzinę</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={
                      !selectedDateTimeBlocks ||
                      selectedDateTimeBlocks.length === 0
                    }
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Rezerwuj termin
        </Button>
      </form>
    </Form>
  );
};
