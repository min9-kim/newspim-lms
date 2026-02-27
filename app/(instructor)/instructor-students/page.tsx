"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  weeks: any[];
}

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status !== "all") params.append("status", status);
      params.append("page", page.toString());
      params.append("limit", "10");

      const response = await fetch(`/api/instructor/students?${params}`);
      const data = await response.json();

      setStudents(data.students);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error("학생 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, status, page]);

  const getAvatarColor = (name: string) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  return (
    <div className="h-full">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">학생 관리</h1>
        <p className="text-gray-500">전체 학생 현황을 확인하고 관리해보세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="학생 이름 또는 이메일 검색"
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={status}
          onChange={handleStatusChange}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체 상태</option>
          <option value="completed">완료</option>
          <option value="in_progress">진행중</option>
          <option value="incomplete">미완료</option>
        </select>
      </div>

      {/* 학생 목록 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-[200px_1fr] border-b border-gray-200">
          <div className="px-6 py-4 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">학생 정보</span>
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">주차별 진도</span>
          </div>
        </div>

        {/* 테이블 본문 */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : !students || students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">학생이 없습니다.</div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-[200px_1fr] border-b border-gray-100 hover:bg-gray-50"
            >
              {/* 학생 정보 */}
              <div className="px-6 py-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(
                    student.name
                  )}`}
                >
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>

              {/* 주차별 진도 */}
              <div className="px-6 py-4">
                <MiniWeekProgressBar weeks={student.weeks} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-600">
          {page} / {totalPages} (총 {total}명)
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// 미니 WeekProgressBar 컴포넌트
function MiniWeekProgressBar({ weeks }: { weeks: any[] }) {
  // 주차별 버튼 스타일
  const getWeekButtonStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in_progress":
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
      case "incomplete":
        return "bg-red-100 text-red-600 border-red-300";
      default:
        return "bg-white text-gray-400 border-gray-200";
    }
  };

  // 상태별 기본 점 색상 (3개)
  const getDefaultDots = (status: string) => {
    switch (status) {
      case "completed":
        return ["bg-green-400", "bg-green-400", "bg-green-400"];
      case "in_progress":
        return ["bg-green-400", "bg-red-300", "bg-yellow-300"];
      case "incomplete":
        return ["bg-red-300", "bg-red-300", "bg-red-300"];
      default:
        return ["bg-gray-200", "bg-gray-200", "bg-gray-200"];
    }
  };

  // 12주차 기본 데이터 생성
  const weekData = Array.from({ length: 12 }, (_, i) => {
    const weekNum = i + 1;
    const weekInfo = weeks?.find((w) => w.week === weekNum);
    return {
      week: weekNum,
      status: weekInfo?.status || "future",
      sessions: weekInfo?.sessions || null,
    };
  });

  return (
    <div className="flex items-center justify-between">
      {weekData.map((week) => {
        // 주차 상태 기준으로 점 색상 결정 (학생 페이지와 동일)
        const dotColors = getDefaultDots(week.status);

        return (
          <div key={week.week} className="flex items-center gap-2 pt-2">
            {/* 3개 점 표시 */}
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${dotColors[idx] || "bg-gray-200"}`}
                />
              ))}
            </div>
            {/* 주차 번호 */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium border ${getWeekButtonStyle(
                week.status
              )}`}
            >
              {week.week}
            </div>
          </div>
        );
      })}
    </div>
  );
}
