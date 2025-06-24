import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const treatments = await db.treatment.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(treatments);
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return NextResponse.json(
      { message: "Wystąpił problem podczas pobierania usług" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate input data
    const { name, description, price, duration, images, video } = data;

    if (!name || !description || price === undefined || !duration) {
      return NextResponse.json(
        { message: "Wszystkie wymagane pola muszą być wypełnione" },
        { status: 400 }
      );
    }

    // Create new treatment
    const newTreatment = await db.treatment.create({
      data: {
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        images: images || [],
        video: video || null,
      },
    });

    return NextResponse.json(newTreatment, { status: 201 });
  } catch (error) {
    console.error("Error creating treatment:", error);
    return NextResponse.json(
      { message: "Wystąpił problem podczas tworzenia usługi" },
      { status: 500 }
    );
  }
}
