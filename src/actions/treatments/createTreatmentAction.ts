"use server";

import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema for treatment
const treatmentSchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
  price: z.coerce.number().min(0, "Cena nie może być ujemna"),
  duration: z.coerce
    .number()
    .int()
    .min(5, "Czas trwania musi być co najmniej 5 minut"),
});

export type TreatmentFormValues = z.infer<typeof treatmentSchema>;

export async function createTreatmentAction(data: TreatmentFormValues) {
  try {
    // Validate data
    const validatedData = treatmentSchema.parse(data);

    // Create new treatment
    const newTreatment = await db.treatment.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        duration: validatedData.duration,
        images: [],
      },
    });

    return { success: true, data: newTreatment };
  } catch (error) {
    console.error("Error creating treatment:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Błąd walidacji danych",
        fieldErrors: error.flatten().fieldErrors,
      };
    }
    return {
      success: false,
      error: "Wystąpił problem podczas tworzenia usługi",
    };
  }
}
