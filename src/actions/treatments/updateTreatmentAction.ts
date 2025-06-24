"use server";

import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema for treatment
const treatmentSchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Cena nie może być ujemna"),
  duration: z.coerce
    .number()
    .int()
    .min(5, "Czas trwania musi być co najmniej 5 minut"),
  isVisible: z.boolean().default(true),
});

export type TreatmentFormValues = z.infer<typeof treatmentSchema>;

export async function updateTreatmentAction(
  id: string,
  data: TreatmentFormValues
) {
  try {
    // Validate data
    const validatedData = treatmentSchema.parse(data);

    // Check if treatment exists
    const existingTreatment = await db.treatment.findUnique({
      where: { id },
    });

    if (!existingTreatment) {
      return {
        success: false,
        error: "Usługa nie została znaleziona",
      };
    }

    // Update the treatment
    const updatedTreatment = await db.treatment.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description
          ? validatedData.description
          : undefined,
        price: validatedData.price,
        duration: validatedData.duration,
        isVisible: validatedData.isVisible,
      },
    });

    return { success: true, data: updatedTreatment };
  } catch (error) {
    console.error("Error updating treatment:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Błąd walidacji danych",
        fieldErrors: error.flatten().fieldErrors,
      };
    }
    return {
      success: false,
      error: "Wystąpił problem podczas aktualizacji usługi",
    };
  }
}
