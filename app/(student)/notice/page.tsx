"use client";

import { useState } from "react";
import Head from "next/head";
import { NOTION_PAGES } from "@/constants/notionPages";

export default function NoticePage() {
  const noticeUrl = NOTION_PAGES.notice;
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <>
      <Head>
        <link rel="preload" href={noticeUrl} as="document" />
      </Head>
      <div className="h-full relative">
      {/* Skeleton UI + 스피너 */}
      {iframeLoading && (
        <div className="absolute inset-0 bg-white z-10 p-6">
          {/* Skeleton 플레이스홀더 */}
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
          {/* 중앙 스피너 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 bg-white/80 p-4 rounded-lg">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-gray-500 text-sm">Notion 로딩 중...</span>
            </div>
          </div>
        </div>
      )}
      <iframe 
        src={noticeUrl} 
        width="100%" 
        height="100%"
        style={{ minHeight: "calc(100vh - 48px)", border: "none" }}
        allowFullScreen
        loading="eager"
        onLoad={() => setIframeLoading(false)}
      />
      </div>
    </>
  );
}
