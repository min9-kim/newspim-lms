import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    // 이미 등록된 이메일인지 확인
    const emailDocRef = doc(db, "studentEmails", email);
    const emailDoc = await getDoc(emailDocRef);

    if (emailDoc.exists()) {
      return NextResponse.json(
        { message: "이미 등록된 학생입니다." },
        { status: 409 }
      );
    }

    // studentEmails 컬렉션에 문서 생성 (이메일을 ID로 사용)
    await setDoc(emailDocRef, {
      email: email,
      registeredAt: new Date().toISOString(),
      status: "pending", // 아직 로그인하지 않은 상태
    });

    return NextResponse.json(
      { message: "학생이 성공적으로 등록되었습니다." },
      { status: 201 }
    );
  } catch (error) {
    console.error("학생 등록 오류:", error);
    return NextResponse.json(
      { message: "학생 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
