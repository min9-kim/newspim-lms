"use client";

import Sidebar from "@/components/common/Sidebar";
import { Home, BookOpen, Calendar, Image as ImageIcon, PenTool, FileText } from "lucide-react";

const menuItems = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/learning", label: "내 학습 현황", icon: BookOpen },
  { href: "/calendar", label: "캘린더", icon: Calendar },
  { href: "/practice", label: "실습", icon: ImageIcon },
  { href: "/quiz", label: "퀴즈", icon: PenTool },
  { href: "/notice", label: "공지사항", icon: FileText },
];

export default function StudentSidebar() {
  return <Sidebar menuItems={menuItems} />;
}
