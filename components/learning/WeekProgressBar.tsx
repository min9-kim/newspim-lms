"use client";

import { cn } from "@/lib/utils";

interface SessionStatus {
  session: number;
  status: "completed" | "in_progress" | "not_started";
}

interface WeekProgress {
  week: number;
  status: "completed" | "in_progress" | "incomplete" | "future";
  sessions?: SessionStatus[];
}

interface WeekProgressBarProps {
  weeks: WeekProgress[];
  currentWeek: number;
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
}

export function WeekProgressBar({
  weeks,
  currentWeek,
  selectedWeek,
  onSelectWeek,
}: WeekProgressBarProps) {
  const getSessionDotColor = (status: SessionStatus["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-400";
      case "in_progress":
        return "bg-yellow-300";
      case "not_started":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
    }
  };

  const getDefaultDots = (weekStatus: WeekProgress["status"]) => {
    switch (weekStatus) {
      case "completed":
        return ["bg-green-400", "bg-green-400", "bg-green-400"];
      case "in_progress":
        return ["bg-green-400", "bg-red-300", "bg-yellow-300"];
      case "incomplete":
        return ["bg-red-300", "bg-red-300", "bg-red-300"];
      case "future":
        return ["bg-gray-200", "bg-gray-200", "bg-gray-200"];
      default:
        return ["bg-gray-200", "bg-gray-200", "bg-gray-200"];
    }
  };

  const getWeekButtonStyle = (weekStatus: WeekProgress["status"]) => {
    switch (weekStatus) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "in_progress":
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
      case "incomplete":
        return "bg-red-100 text-red-600 border-red-300";
      case "future":
        return "bg-white text-gray-400 border-gray-200";
      default:
        return "bg-white text-gray-400 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 min-[1920px]:p-8 shadow-sm">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">주차별 진도</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600">완료</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-gray-600">진행중</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-gray-600">미완료</span>
          </div>
        </div>
      </div>

      {/* 수평 레이아웃: 점점점 1 점점점 2 점점점 3 ... 점점점 12 */}
      <div className="flex items-center justify-between pt-6 pb-2">
        {weeks.map((week) => {
          const dots = week.sessions 
            ? week.sessions.map(s => getSessionDotColor(s.status))
            : getDefaultDots(week.status);

          return (
            <div key={week.week} className="flex items-center">
              {/* 3개의 회차 상태 점 (주차 왼쪽) */}
              <div className="flex items-center gap-[4px] mr-4">
                {dots.map((dotColor, idx) => (
                  <div 
                    key={idx} 
                    className={cn("w-2 h-2 rounded-full", dotColor)}
                  />
                ))}
              </div>
              
              {/* 주차 번호 버튼 */}
              <button
                onClick={() => week.status !== "future" && onSelectWeek(week.week)}
                disabled={week.status === "future"}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all border",
                  getWeekButtonStyle(week.status),
                  week.status === "future" && "cursor-not-allowed",
                  week.status !== "future" && "cursor-pointer hover:opacity-80"
                )}
              >
                {week.week}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
