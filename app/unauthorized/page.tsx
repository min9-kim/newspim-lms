import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">접근 권한 없음</h1>
        <p className="text-gray-600 mb-6">
          이 페이지에 접근할 권한이 없습니다.
        </p>
        <Link 
          href="/login" 
          className="inline-block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          로그인 페이지로
        </Link>
      </div>
    </div>
  );
}
