import { db } from "@/lib/firebase";
import { doc, setDoc, getDocs, collection, updateDoc, deleteField } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const results = [];

    // 1. courseSettings/single에 notionUrls 필드 추가
    await updateDoc(doc(db, "courseSettings", "single"), {
      notionUrls: {
        home: "",
        calendar: "",
        notice: "",
      },
    });
    results.push("✅ courseSettings/single: notionUrls 추가됨");

    // 2. 모든 sessions 문서 조회해서 notionPageId → notionUrl로 변경
    const sessionsSnapshot = await getDocs(collection(db, "sessions"));
    let updatedCount = 0;

    for (const sessionDoc of sessionsSnapshot.docs) {
      const data = sessionDoc.data();
      const sessionId = sessionDoc.id;

      // notionPageId 있으면 notionUrl로 변경
      const updateData: Record<string, unknown> = {
        notionUrl: data.notionPageId || "",
      };

      // notionPageId 필드 삭제 (존재할 경우)
      if ("notionPageId" in data) {
        updateData.notionPageId = deleteField();
      }

      await updateDoc(doc(db, "sessions", sessionId), updateData);
      updatedCount++;
    }

    results.push(`✅ sessions ${updatedCount}개 문서: notionPageId → notionUrl 변경됨`);

    return NextResponse.json({
      success: true,
      message: "DB 구조 업데이트 완료!",
      results,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
