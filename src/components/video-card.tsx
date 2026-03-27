import { VideoWithAuthor } from "@/types/types";
import { Image } from "lucide-react";
import Link from "next/link";

export default function VideoCard({ video }: { video: VideoWithAuthor }) {
  return (
    <Link
      href={`/video/${video.video_id}`}
      className="group flex flex-col gap-2 cursor-pointer"
    >
      <div
        className={`relative ${video.video_type === "shorts" ? "aspect-2/3" : "aspect-video"} w-full overflow-hidden rounded-xl bg-muted`}
      >
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <Image />
          </div>
        )}
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
      </div>
    </Link>
  );
}
