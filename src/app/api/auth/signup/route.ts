import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "İsim çok kısa"),
    email: z.string().trim().email("Geçersiz e-posta adresi"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    confirmPassword: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, email, password } = signupSchema.parse(payload);

    // Check if email is verified
    const verification = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!verification || !verification.verified) {
      return NextResponse.json(
        { message: "E-posta adresi doğrulanmamış. Lütfen önce doğrulama yapın." },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        emailVerified: new Date(), // Mark as verified since we used OTP
      },
    });

    // Delete verification record
    await prisma.emailVerification.delete({
      where: { email },
    });

    return NextResponse.json({ message: "Hesap oluşturuldu" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Geçersiz giriş", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Signup error", error);
    return NextResponse.json(
      { message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
