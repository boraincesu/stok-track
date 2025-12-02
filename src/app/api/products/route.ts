import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

function deriveStatus(stock: number): ProductStatus {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock < 15) return "LOW_STOCK";
  return "IN_STOCK";
}

// GET /api/products - Tüm ürünleri getir
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category.name,
      price: p.price,
      stock: p.stock,
      status:
        p.status === "IN_STOCK"
          ? "In Stock"
          : p.status === "LOW_STOCK"
          ? "Low Stock"
          : "Out of Stock",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Yeni ürün ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, price, stock } = body;

    if (!name || !category || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kategori bul veya oluştur
    let categoryRecord = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { name: category },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        status: deriveStatus(Number(stock)),
        categoryId: categoryRecord.id,
      },
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

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
