import Link from "next/link";
import { Play } from "lucide-react";
import { VideoCardData } from "@/types/types";

export default function VideoGridSimple({
  videos,
  emptyText,
}: {
  videos: VideoCardData[];
  emptyText: string;
}) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <Link
          href={`/video/${video.video_id}`}
          key={video.video_id}
          className="group"
        >
          <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center relative overflow-hidden">
            <Play className="h-8 w-8 text-muted-foreground group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>

            {video.author_username && (
              <p className="text-xs text-muted-foreground">
                {video.author_username}
              </p>
            )}

            <p className="text-[10px] text-muted-foreground mt-1">
              {video.watched_at
                ? `Просмотрено: ${new Date(video.watched_at).toLocaleDateString()}`
                : `${video.views_count} просмотров`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
