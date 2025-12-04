import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { sendOtpEmail, generateOtp } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sendOtpSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta adresi giriniz"),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { email } = sendOtpSchema.parse(payload);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert verification record
    await prisma.emailVerification.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
        verified: false,
      },
      create: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send email
    await sendOtpEmail(email, otp);

    return NextResponse.json(
      { message: "Doğrulama kodu gönderildi" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Geçersiz giriş", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Send OTP error:", error);
    return NextResponse.json(
      { message: "Kod gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
