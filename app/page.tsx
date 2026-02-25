import { redirect } from "next/navigation";

export default function Home() {
  // 홈페이지를 /home으로 리다이렉트
  // (student)/layout.tsx에서 로그인 체크 후 안 되어있으면 /login으로 이동
  redirect("/home");
}
