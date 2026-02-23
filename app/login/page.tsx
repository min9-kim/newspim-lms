export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Newspim AI Academy</h1>
        <p className="text-center text-gray-600 mb-6">로그인</p>
        <button 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => alert("Google 로그인 - Phase 2에서 구현")}
        >
          Google로 로그인
        </button>
      </div>
    </div>
  );
}
