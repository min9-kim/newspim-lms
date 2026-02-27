import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("limit") || "10");

    // 학생 목록 조회 (인덱스 없이)
    const usersRef = collection(db, "users");
    const studentsQuery = query(
      usersRef,
      where("role", "==", "student")
    );

    const studentsSnapshot = await getDocs(studentsQuery);
    let students = studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 검색 필터링 (이름 또는 이메일)
    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(
        (student: any) =>
          student.name?.toLowerCase().includes(searchLower) ||
          student.email?.toLowerCase().includes(searchLower)
      );
    }

    // 현재 주차 계산을 위한 courseSettings 가져오기
    let currentWeek = 1;
    try {
      const settingsDoc = await getDoc(doc(db, "courseSettings", "single"));
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data();
        const startDate = settings.startDate?.toDate?.() || new Date(settings.startDate);
        const now = new Date();
        const diffTime = now.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        currentWeek = Math.floor(diffDays / 7) + 1;
        if (currentWeek < 1) currentWeek = 1;
        if (currentWeek > 12) currentWeek = 12;
      }
    } catch (err) {
      console.error("현재 주차 계산 실패:", err);
    }

    // sessions 데이터 가져오기
    const sessionsSnapshot = await getDocs(collection(db, "sessions"));
    const sessions = sessionsSnapshot.docs.map(doc => ({
      id: doc.id,
      week: doc.data().week || 1,
      session: doc.data().session || 1,
      practices: doc.data().practices || [],
    }));

    console.log("Sessions 개수:", sessions.length);
    console.log("현재 주차:", currentWeek);

    // 각 학생의 진도 데이터 가져오기
    const studentsWithProgress = await Promise.all(
      students.map(async (student: any) => {
        try {
          // 문서 ID로 직접 조회 (학생 ID = studentProgress 문서 ID)
          const progressDocRef = doc(db, "studentProgress", student.id);
          const progressDoc = await getDoc(progressDocRef);

          let weeks = [];
          if (progressDoc.exists()) {
            const progressData = progressDoc.data();
            const practices = progressData.practices || {};
            
            // practices 객체를 weeks 배열로 변환
            // 1-1, 1-2, 1-3 → 1주차
            // 2-1, 2-2, 2-3 → 2주차
            const weekMap = new Map();
            
            Object.entries(practices).forEach(([sessionId, sessionData]: [string, any]) => {
              const weekNum = parseInt(sessionId.split('-')[0]);
              const completed = sessionData.completed || [];
              const total = sessionData.total || 0;
              
              if (!weekMap.has(weekNum)) {
                weekMap.set(weekNum, { completed: 0, total: 0 });
              }
              
              const weekData = weekMap.get(weekNum);
              weekData.completed += completed.length;
              weekData.total += total;
            });
            
            // 12주차 데이터 생성 (sessions 기반으로 status 계산)
            weeks = [];
            for (let weekNum = 1; weekNum <= 12; weekNum++) {
              // 해당 주차의 세션들 가져오기
              const weekSessions = sessions.filter((s: any) => s.week === weekNum);
              
              // 각 세션의 상태 계산
              const sessionsStatus = weekSessions.map((session: any) => {
                const sessionId = `${weekNum}-${session.session}`;
                const sessionProgress = practices[sessionId] || { completed: [], total: 0 };
                const completed = sessionProgress.completed?.length || 0;
                const total = sessionProgress.total || 0;
                
                if (total === 0) return "not_started";
                if (completed === total) return "completed";
                if (completed > 0) return "in_progress";
                return "not_started";
              });

              // 주차 상태 계산
              let weekStatus = "future";
              if (weekNum < currentWeek) {
                // 현재 주차보다 이전
                if (sessionsStatus.length === 0) {
                  weekStatus = "incomplete";
                } else if (sessionsStatus.every((s: string) => s === "completed")) {
                  weekStatus = "completed";
                } else {
                  weekStatus = "incomplete";
                }
              } else if (weekNum === currentWeek) {
                weekStatus = "in_progress";
              }

              weeks.push({
                week: weekNum,
                status: weekStatus,
                sessions: weekSessions.map((session: any, idx: number) => ({
                  session: session.session,
                  status: sessionsStatus[idx] || "not_started"
                }))
              });
            }
            
            console.log(`학생 ${student.name} (${student.id}):`, weeks.length, "주차 데이터", weeks);
          } else {
            console.log(`학생 ${student.name} (${student.id}): 진도 데이터 없음`);
          }

          return {
            id: student.id,
            name: student.name || "",
            email: student.email || "",
            weeks: weeks,
          };
        } catch (err) {
          console.error(`학생 ${student.id} 진도 조회 실패:`, err);
          return {
            id: student.id,
            name: student.name || "",
            email: student.email || "",
            weeks: [],
          };
        }
      })
    );

    // 상태 필터링
    if (status !== "all") {
      const filteredStudents = studentsWithProgress.filter((student: any) => {
        const hasStatus = student.weeks.some((week: any) => week.status === status);
        return hasStatus;
      });
      students = filteredStudents;
    } else {
      students = studentsWithProgress;
    }

    // 페이지네이션
    const total = students.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedStudents = students.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      students: paginatedStudents,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("학생 목록 조회 실패:", error);
    return NextResponse.json(
      { error: "학생 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
