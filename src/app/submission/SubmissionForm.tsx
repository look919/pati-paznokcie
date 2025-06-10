"use client";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { submissionAction } from "./submissionAction";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DATE_FORMAT } from "@/lib/time";
import { useEffect, useState } from "react";
import { getAvailableDatesAction } from "./getAvailableDatesAction";

type SubmissionFormProps = {
  treatments: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
};

const submissionFormSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  surname: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.string().email("Nieprawidłowy adres e-mail"),
  phone: z.string().min(1, "Numer telefonu jest wymagany"),
  treatments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        duration: z.number(),
      })
    )
    .min(1, "Musisz wybrać co najmniej jedną usługę"),
  date: z.date().min(new Date(), "Nieprawidłowa data"),
  startTime: z.string().min(1, "Godzina wizyty jest wymagana"),
  duration: z.number().min(1, "Czas trwania usług musi być większy niż 0"),
});

export type SubmissionFormData = z.infer<typeof submissionFormSchema>;

export const SubmissionForm = ({ treatments }: SubmissionFormProps) => {
  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      treatments: [],
      date: undefined,
      startTime: undefined,
    },
  });

  const selectedTreatments = form.watch("treatments");
  const selectedDate = form.watch("date");

  const totalPrice = selectedTreatments.reduce(
    (sum, treatment) => sum + treatment.price,
    0
  );

  const totalDuration = selectedTreatments.reduce(
    (sum, treatment) => sum + treatment.duration,
    0
  );

  const [availableDates, setAvailableDates] = useState<
    {
      date: string;
      freeTimes: string[];
    }[]
  >([]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      const dates = await getAvailableDatesAction(totalDuration);
      setAvailableDates(dates);
    };

    if (totalDuration > 0 && treatments.length > 0) {
      fetchAvailableDates();
      form.setValue("duration", totalDuration);
      form.setValue("date", undefined);
      form.setValue("startTime", "");
    }
  }, [totalDuration, treatments.length, form]);

  useEffect(() => {
    if (selectedDate) {
      form.setValue("startTime", "");
    }
  }, [form, selectedDate]);

  const handleSubmitForm = async (data: SubmissionFormData) => {
    console.log("tom", data);
    try {
      console.log("Form data:", data);
      const submissionId = await submissionAction({
        ...data,
        duration: totalDuration,
      });
      toast.success(
        "Twoje zgłoszenie zostało pomyślnie wysłane! Powiadomimy cię mailowo o akceptacji terminu wizyty."
      );
      form.reset();

      return submissionId;
    } catch {
      toast.error(
        "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie."
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwisko</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nr telefonu</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="treatments"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Usługi</FormLabel>
                <FormDescription>
                  Wybierz usługi, z których chcesz skorzystać
                </FormDescription>
              </div>
              {treatments.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="treatments"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center gap-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={selectedTreatments.some(
                              (t) => t.id === item.id
                            )}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value.id !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name} - {item.price} zł (~{item.duration} minut)
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="border-b border-gray-200 my-4">
          {totalDuration > 0 ? (
            <span>
              Cena: {totalPrice} zł. Przewidywany czas realizacji:{" "}
              {totalDuration} minut
            </span>
          ) : (
            <span className="text-muted-foreground">
              Wybierz usługi, aby zobaczyć dostępne terminy
            </span>
          )}
        </div>
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
                      disabled={selectedTreatments.length === 0}
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
                    disabled={(date) =>
                      date < dayjs().add(1, "week").toDate() ||
                      date > dayjs().add(3, "month").toDate() ||
                      !availableDates.some(
                        (d) => d.date === dayjs(date).format(DATE_FORMAT)
                      )
                    }
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
                disabled={!selectedDate}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz godzinę" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDates
                    .find(
                      (d) => d.date === dayjs(selectedDate).format(DATE_FORMAT)
                    )
                    ?.freeTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  {availableDates.length === 0 && (
                    <span>Brak dostępnych terminów</span>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Wysyłanie..." : "Wyślij"}
        </Button>
      </form>
    </Form>
  );
};
