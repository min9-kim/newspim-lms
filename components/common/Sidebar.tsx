"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuth";
import { logout as firebaseLogout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { LogOut, type LucideIcon, MessageCircle } from "lucide-react";

export interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export default function Sidebar({ menuItems }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await firebaseLogout();
    logout();
    document.cookie = "auth=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* 로고 */}
      <div className="px-4 py-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Newspim AI Academy"
            width={28}
            height={28}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-xs text-gray-900">
          NEWSPIM AI ACADEMY
        </span>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 h-12 rounded-2xl transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 문의하기 카드 - 공통 */}
      <div className="px-2 py-2">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-900">뉴스핌 AI에 문의할</p>
              <p className="text-[11px] text-gray-500">사항이 있으신가요?</p>
            </div>
          </div>
          <button className="w-full mt-2 py-1.5 text-[11px] font-medium text-blue-600 hover:text-blue-700">
            문의하기
          </button>
        </div>
      </div>

      {/* 사용자 정보 - 한 줄로 */}
      <div className="px-4 py-4 mb-2 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "사용자"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            로그아웃
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
