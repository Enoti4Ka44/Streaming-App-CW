import { Video } from "@/types/video";
import { Image, Play } from "lucide-react";
import Link from "next/link";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/video/${video.video_id}`}
      className="group flex flex-col gap-2 cursor-pointer"
    >
      <div
        className={`relative ${video.video_type === "shorts" ? "aspect-2/3" : "aspect-video"} w-full overflow-hidden rounded-xl bg-muted`}
      >
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
          <Play />
        </div>
        <span
          className={`absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5  rounded-md`}
        >
          {video.duration ? video.duration + "s" : "-"}
        </span>
      </div>

      <div className="flex flex-col">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {video.author_username}
        </p>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{video.views_count} просмотров</span>
          <span>•</span>
          <span>{new Date(video.created_at).toLocaleDateString("ru-RU")}</span>
        </div>
        {video.watched_at && (
          <p className="text-[10px] text-muted-foreground mt-1">
            Просмотрено: {new Date(video.watched_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
}
