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
    <div className="bg-white rounded-2xl p-4 min-[1920px]:p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-sm min-[1920px]:text-base font-semibold pb-3 border-b border-gray-200">
        {week}-{session}회차
      </h3>

      <div className="flex-1 flex flex-col justify-between pt-3 min-[1920px]:pt-4">
        {/* 수업 */}
        <div className="flex items-center justify-between py-5 px-3 min-[1920px]:py-6 min-[1920px]:px-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3 min-[1920px]:gap-4">
            <div className="w-10 h-10 min-[1920px]:w-12 min-[1920px]:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 min-[1920px]:w-6 min-[1920px]:h-6 text-blue-500" />
            </div>
            <span className="font-medium text-base min-[1920px]:text-lg">수업</span>
          </div>
          {lessonUrl ? (
            <a
              href={lessonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm min-[1920px]:text-base text-gray-500 hover:text-blue-500"
            >
              바로가기 &gt;
            </a>
          ) : (
            <span className="text-sm min-[1920px]:text-base text-gray-400">바로가기 &gt;</span>
          )}
        </div>

        {/* 실습 */}
        <button
          onClick={onPracticeClick}
          className="w-full flex items-center justify-between py-5 px-3 min-[1920px]:py-6 min-[1920px]:px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 min-[1920px]:gap-4">
            <div className="w-10 h-10 min-[1920px]:w-12 min-[1920px]:h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <PenTool className="w-5 h-5 min-[1920px]:w-6 min-[1920px]:h-6 text-orange-500" />
            </div>
            <span className="font-medium text-base min-[1920px]:text-lg">실습</span>
            {practiceProgress && practiceStatus === "in_progress" && (
              <span className="text-xs text-gray-400">
                ({practiceProgress.completed}/{practiceProgress.total})
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-sm min-[1920px]:text-base px-3 py-1 rounded-full font-medium",
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
            className="w-full flex items-center justify-between py-5 px-3 min-[1920px]:py-6 min-[1920px]:px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 min-[1920px]:gap-4">
              <div className="w-10 h-10 min-[1920px]:w-12 min-[1920px]:h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 min-[1920px]:w-6 min-[1920px]:h-6 text-green-500" />
              </div>
              <span className="font-medium text-base min-[1920px]:text-lg">퀴즈</span>
            </div>
            <span
              className={cn(
                "text-sm min-[1920px]:text-base px-3 py-1 rounded-full font-medium",
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
