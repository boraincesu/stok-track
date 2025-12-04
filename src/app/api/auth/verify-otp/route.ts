import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const verifyOtpSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta adresi giriniz"),
  otp: z.string().length(6, "Doğrulama kodu 6 haneli olmalıdır"),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { email, otp } = verifyOtpSchema.parse(payload);

    // Find verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!verification) {
      return NextResponse.json(
        { message: "Doğrulama kaydı bulunamadı. Lütfen yeni kod isteyin." },
        { status: 404 }
      );
    }

    // Check if already verified
    if (verification.verified) {
      return NextResponse.json(
        { message: "E-posta zaten doğrulanmış" },
        { status: 200 }
      );
    }

    // Check expiration
    if (new Date() > verification.expiresAt) {
      return NextResponse.json(
        { message: "Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyin." },
        { status: 410 }
      );
    }

    // Check OTP
    if (verification.otp !== otp) {
      return NextResponse.json(
        { message: "Geçersiz doğrulama kodu" },
        { status: 400 }
      );
    }

    // Mark as verified
    await prisma.emailVerification.update({
      where: { email },
      data: { verified: true },
    });

    return NextResponse.json(
      { message: "E-posta doğrulandı" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Geçersiz giriş", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "Doğrulama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
