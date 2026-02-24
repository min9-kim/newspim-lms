import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 공개 경로 (로그인 필요 없음)
const publicRoutes = ["/login", "/unauthorized", "/api/auth"];

// 학생 전용 경로
const studentRoutes = ["/home", "/learning", "/lesson", "/practice", "/quiz", "/calendar", "/notice"];

// 강사 전용 경로
const instructorRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 공개 경로는 통과
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // 정적 파일은 통과
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 쿠키에서 인증 상태 확인
  const authCookie = request.cookies.get("auth");
  
  if (!authCookie) {
    // 로그인되지 않음 → 로그인 페이지로
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const authData = JSON.parse(authCookie.value);
    const { role } = authData;

    // 역할에 따른 접근 제어
    const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route));
    const isInstructorRoute = instructorRoutes.some(route => pathname.startsWith(route));

    if (isStudentRoute && role !== "student" && role !== "instructor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (isInstructorRoute && role !== "instructor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch {
    // 쿠키 파싱 실패 → 로그인 페이지로
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
