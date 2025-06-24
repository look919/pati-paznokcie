"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTreatmentAction } from "@/actions/treatments/createTreatmentAction";
import { updateTreatmentAction } from "@/actions/treatments/updateTreatmentAction";

const treatmentSchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Cena nie może być ujemna"),
  duration: z.coerce
    .number()
    .int()
    .min(5, "Czas trwania musi być co najmniej 5 minut"),
  images: z.array(z.string()).optional(),
  isVisible: z.boolean().default(true),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

type TreatmentFormProps = {
  treatment?: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    images: string[];
    video: string | null;
    isVisible: boolean;
  };
};

export function TreatmentForm({ treatment }: TreatmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define form with default values
  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: treatment
      ? {
          name: treatment.name,
          description: treatment.description,
          price: treatment.price,
          duration: treatment.duration,
          images: treatment.images || [],
          isVisible: treatment.isVisible,
        }
      : {
          name: "",
          description: "",
          price: 0,
          duration: 30,
          images: [],
          isVisible: true,
        },
  });

  // Submit handler
  async function onSubmit(data: TreatmentFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (treatment) {
        result = await updateTreatmentAction(treatment.id, data);
      } else {
        result = await createTreatmentAction(data);
      }

      if (!result.success) {
        throw new Error(result.error || "Coś poszło nie tak");
      }

      // Redirect to treatments page on success
      router.push("/admin/uslugi");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa usługi</FormLabel>
                <FormControl>
                  <Input placeholder="np. Manicure hybrydowy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Szczegółowy opis usługi..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cena (PLN)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Czas trwania (minuty)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isVisible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Widoczna</FormLabel>
                  <FormDescription>
                    Zaznacz, jeśli usługa ma być widoczna dla klientów
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Zapisywanie..."
                : treatment
                ? "Aktualizuj"
                : "Dodaj"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
