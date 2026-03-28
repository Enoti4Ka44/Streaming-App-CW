import { Button } from "@/components/ui/button";
import LikeButton from "@/components/like-button";
import { notFound } from "next/navigation";
import {
  getLikeStatus,
  getSubStatus,
  getVideoById,
  recordView,
} from "@/actions/videoActions";
import VideoPlayer from "@/components/video-player";
import ChannelCard from "@/components/channel-card";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const videoId = parseInt(resolvedParams.id, 10);

  const [video, likeData] = await Promise.all([
    getVideoById(videoId),
    getLikeStatus(videoId),
  ]);

  if (!video) return notFound();

  const subInfo = await getSubStatus(video.author_id);

  recordView(videoId).catch(console.error);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <VideoPlayer url={video.video_url} />

      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <ChannelCard
          subCount={subInfo.subCount}
          author_username={video.author_username}
          author_id={video.author_id}
          isSubscribed={subInfo.isSubscribed}
        />

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
