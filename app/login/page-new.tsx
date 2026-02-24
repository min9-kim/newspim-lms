"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, initAuthListener } from "@/services/authService";
import { useAuthStore } from "@/hooks/useAuth";
import { Chrome } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser, user } = useAuthStore();

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user) {
      if (user.role === "instructor") {
        router.push("/admin");
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
          router.push("/admin");
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
      {/* 왼쪽 패널 - 그라데이션 배경 */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
        style={{
          background: "linear-gradient(135deg, #000428 0%, #004e92 50%, #00d2ff 100%)"
        }}
      >
        {/* 상단 로고 */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/60ad266b767aab4091e0c10758f2a4c3813d7f56.png"
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

      {/* 오른쪽 패널 - 로그인 폼 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* 모바일 로고 (lg 이하에서만 표시) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image
              src="/images/60ad266b767aab4091e0c10758f2a4c3813d7f56.png"
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
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full py-6 border-gray-300 hover:bg-gray-50 font-medium"
              size="lg"
            >
              <Chrome className="mr-3 h-5 w-5 text-red-500" />
              {isLoading ? "로그인 중..." : "Google 계정으로 로그인하기"}
            </Button>

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
