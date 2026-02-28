"use client";

import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleRegisterStudent = async () => {
    if (!newStudentEmail) return;
    
    setIsRegistering(true);
    try {
      const response = await fetch('/api/instructor/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newStudentEmail }),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setNewStudentEmail("");
        fetchStudents();
        alert('학생이 등록되었습니다.');
      } else {
        const error = await response.json();
        alert(error.message || '등록에 실패했습니다.');
      }
    } catch (error) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsRegistering(false);
    }
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

  // 상태별 기본 점 색상 (3개) - 연한 색상으로 변경
  const getDefaultDots = (status: string) => {
    switch (status) {
      case "completed":
        return ["bg-green-300", "bg-green-300", "bg-green-300"];
      case "in_progress":
        return ["bg-green-300", "bg-red-200", "bg-yellow-200"];
      case "incomplete":
        return ["bg-red-200", "bg-red-200", "bg-red-200"];
      case "future":
      case "not_started":
      default:
        return ["bg-gray-100", "bg-gray-100", "bg-gray-100"];
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
      <div className="mb-3 min-[1920px]:mb-4">
        <h1 className="text-xl min-[1920px]:text-2xl font-bold text-gray-900 mb-0.5 min-[1920px]:mb-1">학생 관리</h1>
        <p className="text-xs min-[1920px]:text-sm text-gray-500">전체 학생 현황을 확인하고 관리해보세요</p>
      </div>

      {/* 검색 및 학생 등록 */}
      <div className="flex items-center justify-between gap-4 mb-3 min-[1920px]:mb-4 px-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 min-[1920px]:w-5 min-[1920px]:h-5" />
          <input
            type="text"
            placeholder="학생 이름 또는 이메일 검색"
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 min-[1920px]:pl-10 pr-4 py-1.5 min-[1920px]:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 min-[1920px]:px-4 py-1.5 min-[1920px]:py-2 bg-white text-black border border-black text-xs min-[1920px]:text-sm rounded-lg hover:bg-gray-100 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-3 h-3 min-[1920px]:w-4 min-[1920px]:h-4" />
          학생 등록
        </button>
      </div>

      {/* 학생 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
            <h2 className="text-lg font-bold mb-4">학생 등록</h2>
            <input
              type="email"
              placeholder="학생 이메일 입력"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleRegisterStudent}
                disabled={isRegistering || !newStudentEmail}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isRegistering ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 학생 목록 테이블 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="flex items-center justify-between bg-gray-100 border-b border-gray-200 px-4 py-2 min-[1920px]:py-3">
          <div className="flex">
            <span className="text-sm min-[1920px]:text-base font-medium text-gray-700 mr-8">전체 {total}명의 학생</span>
            <span className="text-sm min-[1920px]:text-base font-medium text-gray-700 ml-20">주차별 진도</span>
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
              className="grid grid-cols-[200px_1fr] border-b border-gray-100 hover:bg-gray-50 py-1.5 min-[1920px]:py-2"
            >
              {/* 학생 정보 */}
              <div className="px-4 py-1.5 min-[1920px]:py-3 flex items-center gap-3">
                <div
                  className={`w-8 h-8 min-[1920px]:w-9 min-[1920px]:h-9 rounded-full flex items-center justify-center text-white text-xs min-[1920px]:text-sm font-medium ${getAvatarColor(
                    student.name
                  )}`}
                >
                  {student.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs min-[1920px]:text-sm font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-[10px] min-[1920px]:text-xs text-gray-500 truncate">{student.email}</p>
                </div>
              </div>

              {/* 주차별 진도 */}
              <div className="px-4 py-1.5 min-[1920px]:py-3 pr-6">
                <MiniWeekProgressBar weeks={student.weeks} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2 mt-5 min-[1920px]:mt-6 mb-0.5 min-[1920px]:mb-1">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 min-[1920px]:px-5 py-2 min-[1920px]:py-2.5 text-sm min-[1920px]:text-base text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ◀ 이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`w-9 h-9 min-[1920px]:w-11 min-[1920px]:h-11 text-sm min-[1920px]:text-base rounded ${
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
          className="px-4 min-[1920px]:px-5 py-2 min-[1920px]:py-2.5 text-sm min-[1920px]:text-base text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
}
