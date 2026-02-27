"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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

  // 주차별 버튼 스타일 - 학생 러닝 페이지와 동일
  const getWeekButtonStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "in_progress":
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
      case "incomplete":
        return "bg-red-100 text-red-600 border-red-300";
      case "future":
      case "not_started":
      default:
        return "bg-white text-gray-400 border-gray-200";
    }
  };

  // 상태별 기본 점 색상 (3개) - 학생 러닝 페이지와 동일
  const getDefaultDots = (status: string) => {
    switch (status) {
      case "completed":
        return ["bg-green-400", "bg-green-400", "bg-green-400"];
      case "in_progress":
        return ["bg-green-400", "bg-red-300", "bg-yellow-300"];
      case "incomplete":
        return ["bg-red-300", "bg-red-300", "bg-red-300"];
      case "future":
      case "not_started":
      default:
        return ["bg-gray-200", "bg-gray-200", "bg-gray-200"];
    }
  };

  const MiniWeekProgressBar = ({ weeks }: { weeks: any[] }) => {
    const weekData = weeks || Array.from({ length: 12 }, (_, i) => ({ week: i + 1, status: "not_started" }));

    return (
      <div className="flex items-center justify-between w-full">
        {weekData.map((week) => {
          const dotColors = getDefaultDots(week.status);

          return (
            <div key={week.week} className="flex items-center flex-1 justify-center min-w-0">
              <div className="flex items-center mr-1">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full mr-0.5 ${dotColors[idx] || "bg-gray-200"}`}
                  />
                ))}
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium border ${getWeekButtonStyle(
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
  };

  return (
    <div className="bg-gray-50">
      {/* 헤더 */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">학생 관리</h1>
        <p className="text-sm text-gray-500">전체 학생 현황을 확인하고 관리해보세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="학생 이름 또는 이메일 검색"
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* 학생 목록 테이블 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-[200px_1fr] bg-gray-100 border-b border-gray-200">
          <div className="px-4 py-3">
            <span className="text-sm font-medium text-gray-700">전체 {total}명의 학생</span>
          </div>
          <div className="px-4 py-3">
            <span className="text-sm font-medium text-gray-700">주차별 진도</span>
          </div>
        </div>

        {/* 테이블 본문 */}
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">로딩 중...</div>
        ) : !students || students.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">학생이 없습니다.</div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-[200px_1fr] border-b border-gray-100 hover:bg-gray-50"
            >
              {/* 학생 정보 */}
              <div className="px-4 py-2 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                    student.name
                  )}`}
                >
                  {student.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-xs text-gray-500 truncate">{student.email}</p>
                </div>
              </div>

              {/* 주차별 진도 */}
              <div className="px-4 py-2 pr-6">
                <MiniWeekProgressBar weeks={student.weeks} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2 mt-4 mb-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ◀ 이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`w-10 h-10 text-sm rounded ${
              page === pageNum
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        ))}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
}
