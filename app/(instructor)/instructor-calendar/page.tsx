import { NOTION_PAGES } from "@/constants/notionPages";

export default function InstructorCalendarPage() {
  return (
    <div className="h-full">
      <iframe
        src={NOTION_PAGES.calendar}
        width="100%"
        height="100%"
        style={{ minHeight: "calc(100vh - 48px)", border: "none" }}
        allowFullScreen
      />
    </div>
  );
}
