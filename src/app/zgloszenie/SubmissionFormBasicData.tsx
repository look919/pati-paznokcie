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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import type { SubmissionFormState } from "./SubmissionForm";
import { cn } from "@/lib/utils";

type Treatment = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type SubmissionFormBasicDataProps = {
  form: ReturnType<typeof useForm<SubmissionFormBasicDataSchema>>;
  treatments: Treatment[];
  submissionFormState: SubmissionFormState;
  onSubmit: (data: SubmissionFormBasicDataSchema) => void;
  setSubmissionFormState: (state: SubmissionFormState) => void;
};

export const submissionFormBasicDataSchema = z.object({
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
});

export type SubmissionFormBasicDataSchema = z.infer<
  typeof submissionFormBasicDataSchema
>;

const submissionsButtonText = {
  FILLING_BASIC_DATA: "Znajdź dostępne terminy",
  PENDING_FILLING_BASIC_DATA: "Szukam dostępnych terminów...",
  CHOOSE_DATE: "Powróć do wyboru usług",
  PENDING_CHOOSE_DATE: "Powróć do wyboru usług",
  SUCCESS: undefined,
};

export const SubmissionFormBasicData = ({
  treatments,
  form,
  submissionFormState,
  onSubmit,
  setSubmissionFormState,
}: SubmissionFormBasicDataProps) => {
  const selectedTreatments = form.watch("treatments");

  useEffect(() => {
    const duration = selectedTreatments.reduce(
      (acc, curr) => acc + curr.duration,
      0
    );

    form.setValue("duration", duration);
  }, [selectedTreatments, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn("flex flex-col gap-6", {
            "opacity-50 pointer-events-none":
              submissionFormState !== "FILLING_BASIC_DATA",
          })}
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
                  <Input
                    {...field}
                    type="tel"
                    className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                  />
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
                            {item.name} - {item.price} zł (~{item.duration}{" "}
                            minut)
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
        </div>
        {submissionFormState === "FILLING_BASIC_DATA" ||
        submissionFormState === "PENDING_FILLING_BASIC_DATA" ? (
          <Button
            type="submit"
            className="mt-6 w-full inline-flex justify-center py-3 px-8 border border-transparent shadow-sm rounded-full text-white 
                       bg-gradient-to-r from-sky-400 to-blue-500
                       hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            disabled={submissionFormState === "PENDING_FILLING_BASIC_DATA"}
          >
            {submissionsButtonText[submissionFormState]}
          </Button>
        ) : null}

        {submissionFormState === "CHOOSE_DATE" ||
        submissionFormState === "PENDING_CHOOSE_DATE" ? (
          <Button
            type="button"
            variant="link"
            className="mt-6 w-full text-sky-600"
            onClick={() => setSubmissionFormState("FILLING_BASIC_DATA")}
          >
            {submissionsButtonText[submissionFormState]}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};
