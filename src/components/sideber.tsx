import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  currentType: "video" | "shorts";
}

export default function Sidebar({ currentType }: SidebarProps) {
  return (
    <aside className="w-64 p-4 border-r min-h-[calc(100vh-64px)] hidden md:block">
      <nav className="flex flex-col gap-2">
        <Link href="/?type=video">
          <Button
            variant={currentType === "video" ? "secondary" : "ghost"}
            className="w-full justify-start text-lg"
          >
            Видео
          </Button>
        </Link>
        <Link href="/?type=shorts">
          <Button
            variant={currentType === "shorts" ? "secondary" : "ghost"}
            className="w-full justify-start text-lg"
          >
            Shorts
          </Button>
        </Link>
      </nav>
    </aside>
  );
}
