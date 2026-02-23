export const metadata = {
  title: "학생용 LMS",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* 사이드바는 나중에 구현 */}
      <aside className="w-64 bg-gray-100 border-r p-4">
        <nav className="space-y-2">
          <a href="/home" className="block p-2 hover:bg-gray-200 rounded">홈</a>
          <a href="/learning" className="block p-2 hover:bg-gray-200 rounded">내 학습 현황</a>
          <a href="/calendar" className="block p-2 hover:bg-gray-200 rounded">캘린더</a>
          <a href="/practice" className="block p-2 hover:bg-gray-200 rounded">실습</a>
          <a href="/quiz" className="block p-2 hover:bg-gray-200 rounded">퀴즈</a>
          <a href="/notice" className="block p-2 hover:bg-gray-200 rounded">공지사항</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
