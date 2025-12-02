import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

function deriveStatus(stock: number): ProductStatus {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock < 15) return "LOW_STOCK";
  return "IN_STOCK";
}

// GET /api/products/[id] - Tek ürün getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formatted = {
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: product.price,
      stock: product.stock,
      status:
        product.status === "IN_STOCK"
          ? "In Stock"
          : product.status === "LOW_STOCK"
          ? "Low Stock"
          : "Out of Stock",
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Ürün güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { price, stock, name, category } = body;

    const updateData: Record<string, unknown> = {};

    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) {
      updateData.stock = Number(stock);
      updateData.status = deriveStatus(Number(stock));
    }
    if (name !== undefined) updateData.name = name;

    if (category !== undefined) {
      let categoryRecord = await prisma.category.findUnique({
        where: { name: category },
      });

      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({
          data: { name: category },
        });
      }

      updateData.categoryId = categoryRecord.id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    const formatted = {
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: product.price,
      stock: product.stock,
      status:
        product.status === "IN_STOCK"
          ? "In Stock"
          : product.status === "LOW_STOCK"
          ? "Low Stock"
          : "Out of Stock",
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Ürün sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
