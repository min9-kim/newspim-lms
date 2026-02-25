"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CourseSettings {
  notionUrls?: {
    home?: string;
    calendar?: string;
    notice?: string;
  };
}

export default function HomePage() {
  const [homeUrl, setHomeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Firebase Persistence가 활성화되어 있으면 자동으로 캐시 사용
        const settingsDoc = await getDoc(doc(db, "courseSettings", "single"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data() as CourseSettings;
          setHomeUrl(data.notionUrls?.home || "");
        }
      } catch (error) {
        console.error("Settings 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Skeleton UI 로딩 상태
  if (loading) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* iframe 로딩 중 스피너 */}
      {iframeLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-gray-500 text-sm">로딩 중...</span>
          </div>
        </div>
      )}
      <iframe 
        src={homeUrl} 
        width="100%" 
        height="100%"
        style={{ minHeight: "calc(100vh - 48px)", border: "none" }}
        allowFullScreen
        loading="lazy"
        onLoad={() => setIframeLoading(false)}
      />
    </div>
  );
}
