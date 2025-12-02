import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { validateAndConsumeResetToken } from "@/lib/password-reset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resetSchema = z.object({
  token: z.string().min(10, "Missing reset token"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { token, password } = resetSchema.parse(payload);

    const userId = await validateAndConsumeResetToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: "Reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Reset password error", error);
    return NextResponse.json(
      { message: "Unable to reset password. Please try again." },
      { status: 500 }
    );
  }
}
