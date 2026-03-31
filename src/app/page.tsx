import { getVideos } from "@/actions/videoActions";
import Sidebar from "@/components/sideber";
import VideoCard from "@/components/video-card";
import VideoFilters from "@/components/video-filters";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const search =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;
  const type = resolvedParams.type === "shorts" ? "shorts" : "video";
  const country =
    typeof resolvedParams.country === "string"
      ? resolvedParams.country
      : undefined;
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest";

  const videos = await getVideos(type, country, sort, search);

  return (
    <div className="flex">
      <Sidebar currentType={type} />

      <main className="flex-1 p-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">
            {type === "shorts" ? "Популярные Shorts" : "Рекомендованные видео"}
          </h1>

          <VideoFilters />
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-muted/10">
            <p className="text-muted-foreground">Видео не найдены.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
