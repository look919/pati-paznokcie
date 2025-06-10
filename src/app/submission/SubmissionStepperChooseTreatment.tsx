"use client";

import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { findTreatmentDateAction } from "./findTreatmentDateAction";
import { toast } from "sonner";

type Treatment = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type SubmissionStepperChooseTreatmentProps = {
  treatments: Treatment[];
  goToTheNextStep: () => void;
};

const chooseTreatmentSchema = z.object({
  duration: z.number().min(0, "Czas trwania musi być większy od 0"),
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
});
type ChooseTreatmentFormData = z.infer<typeof chooseTreatmentSchema>;

export const SubmissionStepperChooseTreatment = ({
  treatments,
  goToTheNextStep,
}: SubmissionStepperChooseTreatmentProps) => {
  const form = useForm<ChooseTreatmentFormData>({
    resolver: zodResolver(chooseTreatmentSchema),
    defaultValues: {
      treatments: [],
      duration: 0,
    },
  });

  const selectedTreatments = form.watch("treatments");

  useEffect(() => {
    const totalDuration = selectedTreatments.reduce(
      (total, treatment) => total + treatment.duration,
      0
    );

    form.setValue("duration", totalDuration);
  }, [selectedTreatments, form]);

  const handleSubmitForm = async (data: ChooseTreatmentFormData) => {
    try {
      const dates = await findTreatmentDateAction(data.duration);
      sessionStorage.setItem(
        "submission-treatments",
        JSON.stringify(data.treatments)
      );
      sessionStorage.setItem("submission-duration", data.duration.toString());
      sessionStorage.setItem(
        "submission-available-dates",
        JSON.stringify(dates)
      );
      // add timeout to allow the user to see the status message on the button
      await new Promise((resolve) => setTimeout(resolve, 2000));

      goToTheNextStep();
    } catch {
      toast.error(
        "Wystąpił błąd podczas wyszukiwania terminów. Spróbuj ponownie później."
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Szukam terminów..."
            : "Znajdź wolne terminy"}
        </Button>
      </form>
    </Form>
  );
};
