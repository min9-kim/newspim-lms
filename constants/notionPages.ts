// Notion Embed Page URLs
// 환경 변수에서 노션 페이지 URL을 가져옵니다
// .env.local 파일에 NEXT_PUBLIC_NOTION_*_URL 형식으로 설정 (예: https://...?theme=light)

export const NOTION_PAGES = {
  home: process.env.NEXT_PUBLIC_NOTION_HOME_URL || "",
  calendar: process.env.NEXT_PUBLIC_NOTION_CALENDAR_URL || "",
  notice: process.env.NEXT_PUBLIC_NOTION_NOTICE_URL || "",
} as const;

export type NotionPageKey = keyof typeof NOTION_PAGES;
