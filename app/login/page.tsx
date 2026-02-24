"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginButton } from "@/components/common/LoginButton";
import { signInWithGoogle, initAuthListener } from "@/services/authService";
import { useAuthStore } from "@/hooks/useAuth";
import Image from "next/image";

// Google 로고 SVG
const GoogleIcon = () => (
  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, user } = useAuthStore();

  // 쿼리 파라미터에서 에러 확인
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      setError("접근 권한이 없습니다. 관리자에게 문의하세요.");
    }
  }, [searchParams]);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user) {
      if (user.role === "instructor") {
        router.push("/instructor-home");
      } else {
        router.push("/home");
      }
    }
  }, [user, router]);

  // Firebase 인증 상태 감지
  useEffect(() => {
    const unsubscribe = initAuthListener((authUser) => {
      if (authUser) {
        setUser(authUser);
        document.cookie = `auth=${JSON.stringify({ role: authUser.role })}; path=/; max-age=86400`;
      } else {
        document.cookie = "auth=; path=/; max-age=0";
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const authUser = await signInWithGoogle();
      if (authUser) {
        setUser(authUser);
        document.cookie = `auth=${JSON.stringify({ role: authUser.role })}; path=/; max-age=86400`;
        
        // 역할에 따른 리다이렉트
        if (authUser.role === "instructor") {
          router.push("/instructor-home");
        } else {
          router.push("/home");
        }
      }
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 왼쪽 패널 - 배경 이미지 (35%) */}
      <div 
        className="hidden lg:flex lg:w-[35%] flex-col justify-between p-12 text-white"
        style={{
          backgroundImage: "url('/images/login_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* 상단 로고 */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Newspim AI Academy"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-lg tracking-wide">NEWSPIM AI ACADEMY</span>
        </div>

        {/* 하단 설명 */}
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-4">뉴스핀 AI 아카데미</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            뉴스핀 AI 아카데미는 생성형 AI 도구 기반 숏츠 및 숏폼 콘텐츠 제작 기술 교육을 
            목표로, AI 기반 콘텐츠 창작자 양성 아카데미입니다. 국가 디지털전환 전략과 
            콘텐츠산업 고도화 정책에 부응하는, 디지털 창작 인재를 배양하고자는 목표를 가지고 있습니다.
          </p>
        </div>
      </div>

      {/* 오른쪽 패널 - 로그인 폼 (약 60%) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* 모바일 로고 (lg 이하에서만 표시) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image
              src="/images/logo.png"
              alt="Newspim AI Academy"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-lg text-gray-900">NEWSPIM AI ACADEMY</span>
          </div>

          {/* 로그인 카드 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-sm text-gray-500 mb-8">
              시작하기 위해 Google 계정으로 로그인해주세요.
            </p>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Google 로그인 버튼 */}
            <LoginButton
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              {isLoading ? "로그인 중..." : "Google 계정으로 로그인하기"}
            </LoginButton>

            {/* 안내 문구 */}
            <p className="mt-6 text-center text-xs text-gray-400">
              사전에 등록된 이메일만 로그인 가능합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
}
