import { NextRequest, NextResponse } from "next/server";
import { generateSupplierEmail } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.productName || !data.quantity) {
      return NextResponse.json(
        { error: "Product name and quantity are required" },
        { status: 400 }
      );
    }

    const email = await generateSupplierEmail({
      productName: data.productName,
      quantity: data.quantity,
      supplierName: data.supplierName,
      currentStock: data.currentStock || 0,
      unit: data.unit || "adet",
    });

    return NextResponse.json({ email });
  } catch (error) {
    console.error("AI email error:", error);
    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}
