"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/useAuth";
import { WeekProgressBar } from "@/components/learning/WeekProgressBar";
import { SessionCard } from "@/components/learning/SessionCard";

interface Session {
  week: number;
  session: number;
  hasPractice: boolean;
  practiceTotalItems: number;
  hasQuiz: boolean;
  notionPageId: string;
}

interface StudentProgress {
  practices: Record<string, { total: number; completed: number[] }>;
  quizzes: string[];
}

interface CourseSettings {
  startDate: Date;
  totalWeeks: number;
}

type WeekStatus = "completed" | "in_progress" | "incomplete" | "future";
type ItemStatus = "completed" | "in_progress" | "not_started";

export default function LearningPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [courseSettings, setCourseSettings] = useState<CourseSettings | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);

  // 현재 주차 계산
  const calculateCurrentWeek = (startDate: Date): number => {
    // 개발용 오버라이드
    const devWeek = process.env.NEXT_PUBLIC_DEV_OVERRIDE_WEEK;
    if (devWeek) {
      return parseInt(devWeek);
    }

    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const week = Math.floor(diffDays / 7) + 1;
    return Math.min(Math.max(week, 1), 12);
  };

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // courseSettings 가져오기
        const settingsDoc = await getDoc(doc(db, "courseSettings", "single"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          const settings: CourseSettings = {
            startDate: data.startDate.toDate(),
            totalWeeks: data.totalWeeks,
          };
          setCourseSettings(settings);
          
          const week = calculateCurrentWeek(settings.startDate);
          setCurrentWeek(week);
          setSelectedWeek(week);
        }

        // sessions 가져오기
        const sessionsSnapshot = await getDocs(collection(db, "sessions"));
        const sessionsData: Session[] = [];
        sessionsSnapshot.forEach((doc) => {
          sessionsData.push(doc.data() as Session);
        });
        setSessions(sessionsData.sort((a, b) => 
          a.week === b.week ? a.session - b.session : a.week - b.week
        ));

        // studentProgress 가져오기
        const progressDoc = await getDoc(doc(db, "studentProgress", user.id));
        if (progressDoc.exists()) {
          setProgress(progressDoc.data() as StudentProgress);
        } else {
          setProgress({ practices: {}, quizzes: [] });
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 주차별 진도 상태 계산
  const getWeekStatus = (week: number): WeekStatus => {
    if (week > currentWeek) return "future";
    
    const weekSessions = sessions.filter((s) => s.week === week);
    if (weekSessions.length === 0) return "future";

    let allCompleted = true;
    let hasAnyProgress = false;

    for (const session of weekSessions) {
      const sessionId = `${week}-${session.session}`;
      const practiceProgress = progress?.practices[sessionId];
      const quizCompleted = progress?.quizzes.includes(sessionId);

      // 실습 체크
      if (session.hasPractice) {
        if (!practiceProgress || practiceProgress.completed.length === 0) {
          allCompleted = false;
        } else if (practiceProgress.completed.length < practiceProgress.total) {
          allCompleted = false;
          hasAnyProgress = true;
        } else {
          hasAnyProgress = true;
        }
      }

      // 퀴즈 체크
      if (session.hasQuiz && !quizCompleted) {
        allCompleted = false;
      } else if (quizCompleted) {
        hasAnyProgress = true;
      }
    }

    if (allCompleted) return "completed";
    if (week === currentWeek) return "in_progress";
    if (hasAnyProgress || week < currentWeek) return "incomplete";
    return "future";
  };

  // 실습 상태 계산
  const getPracticeStatus = (sessionId: string, total: number): ItemStatus => {
    const practiceProgress = progress?.practices[sessionId];
    if (!practiceProgress || practiceProgress.completed.length === 0) {
      return "not_started";
    }
    if (practiceProgress.completed.length >= total) {
      return "completed";
    }
    return "in_progress";
  };

  // 퀴즈 상태 계산
  const getQuizStatus = (sessionId: string): ItemStatus => {
    return progress?.quizzes.includes(sessionId) ? "completed" : "not_started";
  };

  // 진도율 계산
  const calculateProgressRate = (): number => {
    if (!progress || sessions.length === 0) return 0;

    let totalItems = 0;
    let completedItems = 0;

    sessions.forEach((session) => {
      if (session.week <= currentWeek) {
        const sessionId = `${session.week}-${session.session}`;
        
        if (session.hasPractice) {
          totalItems += session.practiceTotalItems;
          const practiceProgress = progress.practices[sessionId];
          if (practiceProgress) {
            completedItems += practiceProgress.completed.length;
          }
        }

        if (session.hasQuiz) {
          totalItems += 1;
          if (progress.quizzes.includes(sessionId)) {
            completedItems += 1;
          }
        }
      }
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // 주차 데이터 생성
  const weeks = Array.from({ length: 12 }, (_, i) => ({
    week: i + 1,
    status: getWeekStatus(i + 1),
  }));

  // 선택된 주차의 세션들
  const selectedSessions = sessions.filter((s) => s.week === selectedWeek);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">내 학습 현황</h1>
          <p className="text-gray-500 mt-1">나의 학습 현황을 확인하고 진도를 따라가보아요</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
          <span className="text-gray-600">나의 진도율 </span>
          <span className="text-blue-500 font-semibold">{calculateProgressRate()}%</span>
        </div>
      </div>

      {/* 주차별 진도바 */}
      <WeekProgressBar
        weeks={weeks}
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />

      {/* 현재 주차 섹션 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">현재 주차 | {selectedWeek}주차</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedSessions.map((session) => {
            const sessionId = `${session.week}-${session.session}`;
            const practiceProgress = progress?.practices[sessionId];
            
            return (
              <SessionCard
                key={sessionId}
                week={session.week}
                session={session.session}
                lessonUrl={session.notionPageId || undefined}
                practiceStatus={getPracticeStatus(sessionId, session.practiceTotalItems)}
                practiceProgress={
                  practiceProgress
                    ? { completed: practiceProgress.completed.length, total: practiceProgress.total }
                    : { completed: 0, total: session.practiceTotalItems }
                }
                quizStatus={getQuizStatus(sessionId)}
                hasQuiz={session.hasQuiz}
                onPracticeClick={() => console.log("실습 클릭:", sessionId)}
                onQuizClick={() => console.log("퀴즈 클릭:", sessionId)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
