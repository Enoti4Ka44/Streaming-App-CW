import { getVideos } from "@/actions/videoActions";
import Sidebar from "@/components/sideber";
import VideoCard from "@/components/video-card";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const type = resolvedParams.type === "shorts" ? "shorts" : "video";

  const videos = await getVideos(type);

  return (
    <div className="flex">
      <Sidebar currentType={type} />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">
          {type === "shorts" ? "Популярные Shorts" : "Рекомендованные видео"}
        </h1>

        {videos.length === 0 ? (
          <p className="text-muted-foreground">
            В этой категории пока нет видео.
          </p>
        ) : (
          <div
            className={`grid gap-6 ${
              type === "shorts"
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-8"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
