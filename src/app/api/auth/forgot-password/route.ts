import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { issuePasswordResetToken } from "@/lib/password-reset";

const requestSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_MESSAGE =
  "If an account exists for this email, a reset link is on the way.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = requestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const { email } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  try {
    const { token } = await issuePasswordResetToken(user.id, user.email);
    const baseUrl =
      process.env.APP_URL ??
      process.env.NEXTAUTH_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";
    const normalizedBase = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
    const resetLink = `${normalizedBase}/reset-password?token=${encodeURIComponent(
      token
    )}`;
    await sendPasswordResetEmail(user.email, resetLink);
    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Forgot password error", error);
    return NextResponse.json(
      { message: "Unable to send the reset email. Please try again." },
      { status: 500 }
    );
  }
}
