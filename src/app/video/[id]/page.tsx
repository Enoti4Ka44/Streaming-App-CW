import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LikeButton from "@/components/like-button";
import { notFound } from "next/navigation";
import {
  getAuthorSubInfo,
  getLikeStatus,
  getVideoDetails,
  recordView,
} from "@/actions/videoActions";
import SubscribeButton from "@/components/subscribe-button";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const videoId = parseInt(resolvedParams.id, 10);

  if (isNaN(videoId)) return notFound();

  const [video, likeData] = await Promise.all([
    getVideoDetails(videoId),
    getLikeStatus(videoId),
  ]);
  const subInfo = await getAuthorSubInfo(video.author_id);

  if (!video) return notFound();

  recordView(videoId).catch(console.error);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 flex items-center justify-center relative">
        {video.url ? (
          <video controls className="w-full h-full object-contain bg-black">
            <source src={video.url} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        ) : (
          <p className="text-white text-xl">Плеер видео {videoId}</p>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {video.author_username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-bold text-lg">{video.author_username}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {subInfo.subCount} подписчиков
              </span>
            </div>
            <SubscribeButton
              authorId={video.author_id}
              initialIsSubscribed={subInfo.isSubscribed}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LikeButton
            videoId={videoId}
            initialLikes={likeData.likesCount}
            initialIsLiked={likeData.isLiked}
          />
          <Button variant="secondary" className="rounded-full font-semibold">
            Поделиться
          </Button>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-xl p-4 mt-6">
        <div className="flex gap-4 text-sm font-semibold mb-2">
          <span>{video.views_count} просмотров</span>
          <span>
            {new Date(video.created_at).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">
          {video.description || "У этого видео пока нет описания."}
        </div>
      </div>
    </div>
  );
}
