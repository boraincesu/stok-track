import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/settings - Kullanıcı ayarlarını getir
export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        orderAlerts: true,
        lowStockWarnings: true,
        weeklyReports: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "User",
        avatar: user.avatar,
      },
      notifications: {
        orderAlerts: user.orderAlerts ?? true,
        lowStockWarnings: user.lowStockWarnings ?? true,
        weeklyReports: user.weeklyReports ?? false,
      },
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/settings - Kullanıcı ayarlarını güncelle
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profile, notifications } = body;

    const updateData: Record<string, unknown> = {};

    // Profile güncellemesi
    if (profile) {
      if (profile.fullName !== undefined) updateData.name = profile.fullName;
      if (profile.phone !== undefined) updateData.phone = profile.phone;
      if (profile.avatar !== undefined) updateData.avatar = profile.avatar;
    }

    // Bildirim ayarları güncellemesi
    if (notifications) {
      if (notifications.orderAlerts !== undefined)
        updateData.orderAlerts = notifications.orderAlerts;
      if (notifications.lowStockWarnings !== undefined)
        updateData.lowStockWarnings = notifications.lowStockWarnings;
      if (notifications.weeklyReports !== undefined)
        updateData.weeklyReports = notifications.weeklyReports;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        orderAlerts: true,
        lowStockWarnings: true,
        weeklyReports: true,
      },
    });

    return NextResponse.json({
      profile: {
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "User",
        avatar: user.avatar,
      },
      notifications: {
        orderAlerts: user.orderAlerts ?? true,
        lowStockWarnings: user.lowStockWarnings ?? true,
        weeklyReports: user.weeklyReports ?? false,
      },
    });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
