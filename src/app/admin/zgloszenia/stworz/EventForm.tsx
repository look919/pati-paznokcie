"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import z from "zod";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "@/lib/time";
import {
  additionalCalendarTimes,
  DATE_FORMAT,
  getAvailableTimesBasedOnTreatmentDuration,
} from "@/lib/time";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Profile } from "@prisma/client";
import { createEventAction } from "@/actions/event/createEventAction";
import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { InputMask } from "@react-input/mask";

type EventFormProps = {
  treatments: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
  profiles: Profile[];
};

export const eventFormSchema = z.object({
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
  duration: z.number().min(1, "Czas trwania usług musi być większy niż 0"),
  date: z.date().min(new Date(), "Data rozpoczęcia musi być w przyszłości"),
  startTime: z.string().min(1, "Czas rozpoczęcia jest wymagany"),
});

type EventFormSchema = z.infer<typeof eventFormSchema>;

const useGetDefaultDate = () => {
  const searchParams = useSearchParams();

  // Get date from query string if it exists
  const startDateParam = searchParams.get("startDate");

  // Use dayjs for parsing and formatting with timezone awareness
  let defaultDate = undefined;
  let defaultStartTime = "";

  if (startDateParam) {
    try {
      const dateObj = dayjs(startDateParam).tz("Europe/Warsaw");

      if (dateObj.isValid()) {
        defaultDate = dateObj.toDate();
        defaultStartTime = dateObj.format("HH:mm");
      }
    } catch (error) {
      console.error("Error parsing date from query string:", error);
    }
  }

  return {
    date: defaultDate,
    startTime: defaultStartTime,
  };
};

const timeOptions = getAvailableTimesBasedOnTreatmentDuration(0).concat(
  additionalCalendarTimes
);

export const EventForm = ({ treatments, profiles }: EventFormProps) => {
  const defaultDate = useGetDefaultDate();
  const [search, setSearch] = useState("");

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "+48 ",
      treatments: [],
      duration: 0,
      date: defaultDate.date,
      startTime: defaultDate.startTime,
    },
  });
  const selectedTreatments = form.watch("treatments");

  useEffect(() => {
    const duration = selectedTreatments.reduce(
      (acc, curr) => acc + curr.duration,
      0
    );

    form.setValue("duration", duration);
  }, [selectedTreatments, form]);

  const handleCreateEvent = async (data: EventFormSchema) => {
    try {
      // Ensure we're properly handling the date in the client
      // We'll just pass the date as is, and let the server handle timezone conversion
      const eventId = await createEventAction(data);

      toast.success("Wydarzenie zostało dodane do kalendarza!");
      form.reset();
      return eventId;
    } catch {
      toast.error("Wystąpił błąd podczas wysyłania formularza");
    }
  };

  const handleAutocompleteProfile = (profileId: string) => {
    const selectedProfile = profiles.find((p) => p.id === profileId);
    if (selectedProfile) {
      form.setValue("name", selectedProfile.name);
      form.setValue("surname", selectedProfile.surname);
      form.setValue("email", selectedProfile.email);
      form.setValue("phone", selectedProfile.phone);
    }
  };

  return (
    <Form {...form}>
      <Combobox
        placeholder="Znajdź klientkę (wpisz imię, nazwisko lub email)"
        data={profiles.map((profile) => ({
          id: profile.id,
          // Include all searchable information in the label
          label: `${profile.name} ${profile.surname} - ${profile.email}${
            profile.phone ? ` - ${profile.phone}` : ""
          }`,
          // Add a searchData field with normalized data for better searching
          searchData:
            `${profile.name} ${profile.surname} ${profile.email} ${profile.phone}`.toLowerCase(),
        }))}
        value={search}
        onValueChange={(value) => {
          setSearch(value);
          handleAutocompleteProfile(value);
        }}
        className="mb-8"
      />

      <form
        onSubmit={form.handleSubmit(handleCreateEvent)}
        className="w-full flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
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
                <Input
                  {...field}
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
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
                <Input
                  {...field}
                  type="email"
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
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
                <InputMask
                  component={Input}
                  mask="+48 xxx xxx xxx"
                  replacement={{ x: /\d/ }}
                  placeholder="+48 ___ ___ ___"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  type="tel"
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </FormControl>
              <FormDescription>Format: +48 XXX XXX XXX</FormDescription>
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
                  Wybierz usługi, na które ktoś chce się zapisać
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

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-black">Wybierz datę</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full border-gray-200 focus:border-sky-400 focus:ring-sky-400",
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
                    onSelect={(date) => {
                      // Ensure timezone consistency when selecting a date
                      if (date) {
                        const tzAwareDate = dayjs(date)
                          .tz("Europe/Warsaw")
                          .toDate();
                        field.onChange(tzAwareDate);
                      } else {
                        field.onChange(date);
                      }
                    }}
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
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Wybierz godzinę</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-gray-200 focus:border-sky-400 focus:ring-sky-400">
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
              <FormMessage className="text-white/80" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-6 w-full inline-flex justify-center py-3 px-8 border border-transparent shadow-sm rounded-full text-white 
                       bg-gradient-to-r from-sky-400 to-blue-500
                       hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          disabled={form.formState.isSubmitting}
        >
          Stwórz wydarzenie
        </Button>
      </form>
    </Form>
  );
};
