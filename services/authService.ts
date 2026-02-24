import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const provider = new GoogleAuthProvider();

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "student" | "instructor";
}

// 이메일로 역할 확인
export const checkUserRole = async (email: string | null): Promise<"student" | "instructor" | null> => {
  if (!email) return null;
  
  // 강사 이메일 목록 확인
  const instructorDoc = await getDoc(doc(db, "instructorEmails", email));
  if (instructorDoc.exists()) {
    return "instructor";
  }
  
  // 학생 이메일 목록 확인
  const studentDoc = await getDoc(doc(db, "studentEmails", email));
  if (studentDoc.exists()) {
    return "student";
  }
  
  return null;
};

// Google 로그인 - 자동으로 역할 확인
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    
    if (!firebaseUser.email) {
      throw new Error("이메일 정보를 가져올 수 없습니다.");
    }
    
    // 이메일로 역할 확인
    const actualRole = await checkUserRole(firebaseUser.email);
    
    if (!actualRole) {
      // 등록되지 않은 이메일
      await firebaseSignOut(auth);
      throw new Error("등록되지 않은 이메일입니다. 관리자에게 문의하세요.");
    }
    
    const user: AuthUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || "",
      role: actualRole,
    };
    
    // 사용자 정보 Firestore에 저장
    await saveUserToFirestore(user);
    
    return user;
  } catch (error: any) {
    console.error("Google 로그인 실패:", error);
    throw error;
  }
};

export const saveUserToFirestore = async (user: AuthUser): Promise<void> => {
  const userRef = doc(db, "users", user.id);
  await setDoc(userRef, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    updatedAt: new Date(),
  }, { merge: true });
};

export const logout = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const initAuthListener = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const role = await checkUserRole(firebaseUser.email);
      if (role) {
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          role,
        });
      } else {
        // 역할이 없으면 로그아웃
        await firebaseSignOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
