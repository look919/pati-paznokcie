import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

// Get a specific treatment
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    const treatment = await db.treatment.findUnique({
      where: { id },
      include: {
        submissions: true,
      },
    });

    if (!treatment) {
      return NextResponse.json(
        { message: "Usługa nie została znaleziona" },
        { status: 404 }
      );
    }

    return NextResponse.json(treatment);
  } catch (error) {
    console.error("Error fetching treatment:", error);
    return NextResponse.json(
      { message: "Wystąpił problem podczas pobierania usługi" },
      { status: 500 }
    );
  }
}

// Update a treatment
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const data = await request.json();

    // Validate input data
    const { name, description, price, duration, images, video } = data;

    if (!name || !description || price === undefined || !duration) {
      return NextResponse.json(
        { message: "Wszystkie wymagane pola muszą być wypełnione" },
        { status: 400 }
      );
    }

    // Check if treatment exists
    const existingTreatment = await db.treatment.findUnique({
      where: { id },
    });

    if (!existingTreatment) {
      return NextResponse.json(
        { message: "Usługa nie została znaleziona" },
        { status: 404 }
      );
    }

    // Update the treatment
    const updatedTreatment = await db.treatment.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        images: images || [],
        video: video || null,
      },
    });

    return NextResponse.json(updatedTreatment);
  } catch (error) {
    console.error("Error updating treatment:", error);
    return NextResponse.json(
      { message: "Wystąpił problem podczas aktualizacji usługi" },
      { status: 500 }
    );
  }
}

// Delete a treatment
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if treatment exists
    const existingTreatment = await db.treatment.findUnique({
      where: { id },
      include: {
        submissions: true,
      },
    });

    if (!existingTreatment) {
      return NextResponse.json(
        { message: "Usługa nie została znaleziona" },
        { status: 404 }
      );
    }

    // Check if treatment is used in submissions
    if (existingTreatment.submissions.length > 0) {
      return NextResponse.json(
        {
          message:
            "Nie można usunąć usługi, która jest powiązana z zgłoszeniami",
        },
        { status: 400 }
      );
    }

    // Delete the treatment
    await db.treatment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Usługa została usunięta pomyślnie" });
  } catch (error) {
    console.error("Error deleting treatment:", error);
    return NextResponse.json(
      { message: "Wystąpił problem podczas usuwania usługi" },
      { status: 500 }
    );
  }
}
