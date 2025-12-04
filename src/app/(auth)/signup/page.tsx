"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useRef, KeyboardEvent } from "react";
import { signIn } from "next-auth/react";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const heroStyle = useMemo(
    () => ({
      backgroundImage:
        "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1100&q=80')",
    }),
    []
  );

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    otpRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Kod gönderilirken hata oluştu");
        return;
      }

      setStep(2);
      startCountdown();
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Lütfen 6 haneli kodu giriniz");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Doğrulama başarısız");
        return;
      }

      setStep(3);
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Create account
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Hesap oluşturulamadı");
        return;
      }

      // Auto login after signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Giriş yapılırken hata oluştu");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Kod gönderilirken hata oluştu");
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      startCountdown();
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`${manrope.className} min-h-screen bg-[#F7F9FC] text-[#0d141b]`}
    >
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="relative hidden items-center justify-center bg-slate-100 p-8 md:flex">
          <div
            aria-hidden
            className="h-full w-full rounded-3xl bg-cover bg-center"
            style={heroStyle}
          />
        </div>

        <section className="flex w-full items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/mari-logo.webp"
                  alt="Marisonia Logo"
                  className="h-10 w-10 rounded-lg"
                />
                <h1 className="text-2xl font-bold tracking-tight">
                  Marisonia Stok Takip
                </h1>
              </div>
              <header className="space-y-2">
                <p className="text-4xl font-black leading-tight tracking-tight">
                  {step === 1 && "Hesap oluştur"}
                  {step === 2 && "E-posta doğrulama"}
                  {step === 3 && "Bilgilerinizi girin"}
                </p>
                <p className="text-base text-[#4c739a]">
                  {step === 1 && "E-posta adresinizi girerek başlayın."}
                  {step === 2 && `${email} adresine gönderilen 6 haneli kodu girin.`}
                  {step === 3 && "Son adım - hesap bilgilerinizi tamamlayın."}
                </p>
              </header>

              {/* Step indicator */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      s <= step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <form className="space-y-5" onSubmit={handleSendOtp}>
                <label className="block space-y-2 text-base font-medium">
                  E-posta adresi
                  <input
                    className="h-14 w-full rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] px-4 text-base text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ornek@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                {error && (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Kod Gönder"}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                <div className="space-y-2">
                  <label className="block text-base font-medium">Doğrulama kodu</label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        className="h-14 w-14 rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] text-center text-2xl font-bold text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Doğrulanıyor..." : "Doğrula"}
                </button>

                <div className="text-center text-sm text-[#4c739a]">
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={countdown > 0 || isSubmitting}
                    className={`font-semibold ${
                      countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    {countdown > 0 ? `Tekrar gönder (${countdown}s)` : "Kodu tekrar gönder"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setError(null); }}
                  className="w-full text-center text-sm text-[#4c739a] hover:text-blue-600"
                >
                  ← E-posta adresini değiştir
                </button>
              </form>
            )}

            {/* Step 3: Name & Password */}
            {step === 3 && (
              <form className="space-y-5" onSubmit={handleSignup}>
                <label className="block space-y-2 text-base font-medium">
                  Ad Soyad
                  <input
                    className="h-14 w-full rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] px-4 text-base text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label className="block space-y-2 text-base font-medium">
                  Şifre
                  <input
                    className="h-14 w-full rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] px-4 text-base text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="En az 8 karakter"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>

                <label className="block space-y-2 text-base font-medium">
                  Şifre tekrar
                  <input
                    className="h-14 w-full rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] px-4 text-base text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>

                {error && (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
                </button>
              </form>
            )}

            <div className="space-y-3 text-center text-sm text-[#4c739a]">
              <p>
                Zaten hesabınız var mı?{" "}
                <Link
                  className="font-semibold text-blue-600 hover:text-blue-500"
                  href="/login"
                >
                  Giriş yap
                </Link>
              </p>
              <p className="text-xs text-slate-500">
                Kayıt olarak{" "}
                <Link className="underline hover:text-blue-600" href="#">
                  Kullanım Şartları
                </Link>{" "}
                ve{" "}
                <Link className="underline hover:text-blue-600" href="#">
                  Gizlilik Politikası
                </Link>
                &apos;nı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
