import { NextRequest, NextResponse } from "next/server";
import { summarizeReport } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const summary = await summarizeReport({
      totalProducts: data.totalProducts || 0,
      totalStock: data.totalStock || 0,
      lowStockCount: data.lowStockCount || 0,
      outOfStockCount: data.outOfStockCount || 0,
      totalStockValue: data.totalStockValue || 0,
      topCategories: data.topCategories || [],
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
