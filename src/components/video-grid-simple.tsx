import Link from "next/link";
import { Play } from "lucide-react";
import { Video } from "@/types/video";
import VideoCard from "./video-card";

export default function VideoGridSimple({
  videos,
  emptyText,
}: {
  videos: Video[];
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
        <VideoCard key={video.video_id} video={video} />
      ))}
    </div>
  );
}
