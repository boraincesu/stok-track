import { NextRequest, NextResponse } from "next/server";
import { generateProductDescription } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { name, category } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const description = await generateProductDescription(
      name,
      category || "Genel"
    );

    return NextResponse.json({ description });
  } catch (error) {
    console.error("AI description error:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
