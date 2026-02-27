/**
 * Notion 페이지 URL 상수
 * 프론트엔드에서 직접 관리하여 DB 조회 없이 즉시 사용
 */

export const NOTION_PAGES = {
  home: process.env.NEXT_PUBLIC_NOTION_HOME_URL || "",
  calendar: process.env.NEXT_PUBLIC_NOTION_CALENDAR_URL || "",
  notice: process.env.NEXT_PUBLIC_NOTION_NOTICE_URL || "",
} as const;

// 타입 추출
type NotionPageType = keyof typeof NOTION_PAGES;

/**
 * Notion URL 가져오기
 * @param type 페이지 타입 (home | calendar | notice)
 * @returns Notion URL
 */
export function getNotionUrl(type: NotionPageType): string {
  return NOTION_PAGES[type] || "";
}
