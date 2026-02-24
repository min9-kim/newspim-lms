"use client";

import Sidebar from "@/components/common/Sidebar";
import { LayoutDashboard, Users, Calendar, FileText } from "lucide-react";

const menuItems = [
  { href: "/instructor-home", label: "홈", icon: LayoutDashboard },
  { href: "/instructor-students", label: "학생 관리", icon: Users },
  { href: "/instructor-calendar", label: "캘린더", icon: Calendar },
  { href: "/instructor-notice", label: "공지사항", icon: FileText },
];

export default function InstructorSidebar() {
  return <Sidebar menuItems={menuItems} />;
}
