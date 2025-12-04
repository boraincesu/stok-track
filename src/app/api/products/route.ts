import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

function deriveStatus(stock: number, minStock: number = 0): ProductStatus {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= minStock || stock < 15) return "LOW_STOCK";
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
      sku: p.sku,
      barcode: p.barcode,
      category: p.category.name,
      price: p.price,
      costPrice: p.costPrice,
      stock: p.stock,
      minStock: p.minStock,
      unit: p.unit,
      supplier: p.supplier,
      description: p.description,
      location: p.location,
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
    const { 
      name, 
      sku, 
      barcode, 
      category, 
      price, 
      costPrice, 
      stock, 
      minStock,
      unit,
      supplier,
      description,
      location 
    } = body;

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

    const stockNum = Number(stock);
    const minStockNum = Number(minStock) || 0;

    const product = await prisma.product.create({
      data: {
        name: name.toUpperCase(),
        sku: sku || null,
        barcode: barcode || null,
        price: Number(price),
        costPrice: Number(costPrice || 0),
        stock: stockNum,
        minStock: minStockNum,
        unit: unit || "adet",
        supplier: supplier || null,
        description: description || null,
        location: location || null,
        status: deriveStatus(stockNum, minStockNum),
        categoryId: categoryRecord.id,
      },
      include: { category: true },
    });

    const formatted = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category.name,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      supplier: product.supplier,
      description: product.description,
      location: product.location,
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

// DELETE /api/products - Tüm ürünleri sil
export async function DELETE() {
  try {
    await prisma.product.deleteMany({});
    return NextResponse.json({ message: "All products deleted" });
  } catch (error) {
    console.error("Failed to delete all products:", error);
    return NextResponse.json(
      { error: "Failed to delete all products" },
      { status: 500 }
    );
  }
}
