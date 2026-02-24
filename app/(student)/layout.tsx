"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuth";
import { initAuthListener, logout } from "@/services/authService";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuthListener((authUser) => {
      if (authUser) {
        setUser(authUser);
        document.cookie = `auth=${JSON.stringify({ role: authUser.role })}; path=/; max-age=86400`;
      } else {
        setUser(null);
        document.cookie = "auth=; path=/; max-age=0";
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [setUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      document.cookie = "auth=; path=/; max-age=0";
      setUser(null);
      router.push("/login");
    } catch (error) {
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 border-r p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-4">Newspim AI Academy</h2>
        <nav className="space-y-2 flex-1">
          <a href="/home" className="block p-2 hover:bg-gray-200 rounded">홈</a>
          <a href="/learning" className="block p-2 hover:bg-gray-200 rounded">내 학습 현황</a>
          <a href="/calendar" className="block p-2 hover:bg-gray-200 rounded">캘린더</a>
          <a href="/practice" className="block p-2 hover:bg-gray-200 rounded">실습</a>
          <a href="/quiz" className="block p-2 hover:bg-gray-200 rounded">퀴즈</a>
          <a href="/notice" className="block p-2 hover:bg-gray-200 rounded">공지사항</a>
        </nav>
        <div className="mt-4 pt-4 border-t">
          {user && (
            <div className="mb-3 text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-500 text-xs">{user.email}</div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
