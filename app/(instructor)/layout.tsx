"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuth";
import { initAuthListener, logout } from "@/services/authService";
import { toast } from "sonner";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuthListener((authUser) => {
      if (authUser) {
        if (authUser.role !== "instructor") {
          router.push("/unauthorized");
          return;
        }
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
      toast.success("로그아웃되었습니다.");
      router.push("/login");
    } catch (error) {
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-slate-800 text-white p-4">
        <h2 className="font-bold text-lg mb-4">관리자 페이지</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block p-2 hover:bg-slate-700 rounded">대시보드</a>
        </nav>
        <div className="mt-8 pt-4 border-t border-slate-700">
          {user && (
            <div className="mb-3 text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-slate-400 text-xs">{user.email}</div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full text-white hover:bg-slate-700"
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
