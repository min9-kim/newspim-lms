"use client";

import { cn } from "@/lib/utils";
import { FileText, PenTool, HelpCircle } from "lucide-react";

type ItemStatus = "completed" | "in_progress" | "not_started";

interface SessionCardProps {
  week: number;
  session: number;
  lessonUrl?: string;
  practiceStatus: ItemStatus;
  practiceProgress?: { completed: number; total: number };
  quizStatus: ItemStatus;
  hasQuiz: boolean;
  onPracticeClick: () => void;
  onQuizClick: () => void;
}

const dayMap: Record<number, string> = {
  1: "월",
  2: "수", 
  3: "금",
};

export function SessionCard({
  week,
  session,
  lessonUrl,
  practiceStatus,
  practiceProgress,
  quizStatus,
  hasQuiz,
  onPracticeClick,
  onQuizClick,
}: SessionCardProps) {
  const getStatusText = (status: ItemStatus) => {
    switch (status) {
      case "completed":
        return "완료";
      case "in_progress":
        return "진행중";
      case "not_started":
        return "미응시";
    }
  };

  const getStatusStyle = (status: ItemStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "in_progress":
        return "bg-yellow-100 text-yellow-600";
      case "not_started":
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold pb-3 border-b border-gray-200">
        {week}-{session}회차
      </h3>

      <div className="space-y-3 pt-4">
        {/* 수업 */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-medium">수업</span>
          </div>
          {lessonUrl ? (
            <a
              href={lessonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-blue-500"
            >
              바로가기 &gt;
            </a>
          ) : (
            <span className="text-sm text-gray-400">바로가기 &gt;</span>
          )}
        </div>

        {/* 실습 */}
        <button
          onClick={onPracticeClick}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-orange-500" />
            </div>
            <span className="font-medium">실습</span>
            {practiceProgress && practiceStatus === "in_progress" && (
              <span className="text-xs text-gray-400">
                ({practiceProgress.completed}/{practiceProgress.total})
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-xs px-3 py-1 rounded-full font-medium",
              getStatusStyle(practiceStatus)
            )}
          >
            {getStatusText(practiceStatus)}
          </span>
        </button>

        {/* 퀴즈 */}
        {hasQuiz && (
          <button
            onClick={onQuizClick}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="font-medium">퀴즈</span>
            </div>
            <span
              className={cn(
                "text-xs px-3 py-1 rounded-full font-medium",
                getStatusStyle(quizStatus)
              )}
            >
              {getStatusText(quizStatus)}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
