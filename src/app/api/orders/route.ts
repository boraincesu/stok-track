import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders - Tüm siparişleri getir
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((o) => ({
      id: o.orderNo,
      customer: o.customer.name,
      amount: o.amount,
      status:
        o.status === "COMPLETED"
          ? "Completed"
          : o.status === "PENDING"
          ? "Pending"
          : "Canceled",
      date: o.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
