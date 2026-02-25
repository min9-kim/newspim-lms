import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const userId = "LUwb5e25RIXuDw1RuMu5JpBzTJy2";
    
    await setDoc(doc(db, "studentProgress", userId), {
      practices: {
        "2-1": {
          total: 3,
          completed: [1, 3],
        },
      },
      quizzes: ["2-1"],
      updatedAt: Timestamp.now(),
    });
    
    return NextResponse.json({ success: true, message: `studentProgress/${userId} created!` });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
