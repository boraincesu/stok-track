import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🔧 BAKIM MODU - true yaparak bakım modunu aktifleştirin
const MAINTENANCE_MODE = false;

export function proxy(request: NextRequest) {
  // Bakım modu kapalıysa normal devam et
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  // Bakım sayfasına zaten gidiyorsa yönlendirme yapma (sonsuz döngü önleme)
  if (request.nextUrl.pathname === "/maintenance") {
    return NextResponse.next();
  }

  // API route'larını engelleme (optional - gerekirse aç)
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "Site bakımda", message: "Lütfen daha sonra tekrar deneyin" },
      { status: 503 }
    );
  }

  // Static dosyaları engelleme (_next, favicon vb.)
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Diğer tüm istekleri bakım sayfasına yönlendir
  return NextResponse.redirect(new URL("/maintenance", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
