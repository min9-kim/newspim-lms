"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";
import { useAuthStore } from "@/hooks/useAuth";
import { initAuthListener } from "@/services/authService";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser } = useAuthStore();

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <InstructorSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
