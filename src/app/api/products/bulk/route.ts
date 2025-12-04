import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to derive status
function deriveStatus(
  stock: number,
  minStock: number
): "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= minStock) return "LOW_STOCK";
  return "IN_STOCK";
}

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Products array is required" },
        { status: 400 }
      );
    }

    // Get or create categories
    const categoryNames = [
      ...new Set(products.map((p: { category?: string }) => String(p.category || "Genel"))),
    ];
    
    const existingCategories = await prisma.category.findMany({
      where: { name: { in: categoryNames } },
    });
    
    const categoryMap: Record<string, string> = {};
    for (const cat of existingCategories) {
      categoryMap[cat.name] = cat.id;
    }
    
    // Create missing categories
    const missingCategories = categoryNames.filter(name => !categoryMap[name]);
    for (const name of missingCategories) {
      const newCat = await prisma.category.create({
        data: { name },
      });
      categoryMap[name] = newCat.id;
    }

    // Prepare products
    const productsToCreate = products.map((p: Record<string, unknown>) => {
      const stock = Number(p.stock) || 0;
      const minStock = Number(p.minStock) || 0;
      const costPrice = Number(p.costPrice) || 0;
      const price = Number(p.price) || 0;
      const categoryName = String(p.category || "Genel");

      return {
        name: String(p.name || "").toUpperCase(),
        sku: p.sku ? String(p.sku) : null,
        barcode: p.barcode ? String(p.barcode) : null,
        categoryId: categoryMap[categoryName],
        price,
        costPrice,
        stock,
        minStock,
        unit: String(p.unit || "adet"),
        supplier: p.supplier ? String(p.supplier) : null,
        description: p.description ? String(p.description) : null,
        location: p.location ? String(p.location) : null,
        status: deriveStatus(stock, minStock),
      };
    });

    // Filter out products with empty names
    const validProducts = productsToCreate.filter(
      (p) => p.name.trim() !== "" && p.categoryId
    );

    if (validProducts.length === 0) {
      return NextResponse.json(
        { error: "No valid products to import" },
        { status: 400 }
      );
    }

    // Create products in bulk
    const result = await prisma.product.createMany({
      data: validProducts,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} ürün başarıyla eklendi`,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Failed to import products" },
      { status: 500 }
    );
  }
}
