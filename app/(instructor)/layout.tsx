export const metadata = {
  title: "강사용 관리자",
};

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-slate-800 text-white p-4">
        <nav className="space-y-2">
          <a href="/admin" className="block p-2 hover:bg-slate-700 rounded">관리자 홈</a>
          <a href="/admin/quizzes" className="block p-2 hover:bg-slate-700 rounded">퀴즈 관리</a>
          <a href="/admin/practices" className="block p-2 hover:bg-slate-700 rounded">실습 관리</a>
          <a href="/admin/settings" className="block p-2 hover:bg-slate-700 rounded">과정 설정</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
