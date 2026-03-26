import { VideoWithAuthor } from "@/types/types";
import VideoCard from "./video-card";

export function VideoList({ videos }: { videos: VideoWithAuthor[] }) {
  if (videos.length === 0) {
    return <p>No videos found</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {videos.map((video) => (
        <VideoCard key={video.video_id} video={video} />
      ))}
    </div>
  );
}
