import { ChannelStats } from "@/types/channel";
import { Calendar, Users, PlaySquare, Eye, Info, Globe2 } from "lucide-react";

export default function StudioHeader({
  stats,
}: {
  stats: ChannelStats | null;
}) {
  if (!stats) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(stats);

  return (
    <div className="bg-card border rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
          {stats.username[0].toUpperCase()}
        </div>

        <div className="flex-1 relative">
          <div className="absolute top-0 right-2 text-sm flex items-center text-muted-foreground">
            <Globe2 className="h-4 w-4 mr-2" />
            {stats.country || "Страна не указана"}
          </div>
          <h1 className="text-3xl font-bold">{stats.username}</h1>
          <p className="text-muted-foreground text-sm flex items-center mt-1">
            <Info className="h-3 w-3 mr-1" />
            {stats.channel_description || "Описание канала не добавлено"}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center bg-secondary/50 px-3 py-1 rounded-full">
              <Users className="h-4 w-4 mr-2" />
              <span className="font-semibold mr-1">
                {stats.subscribers_count}
              </span>{" "}
              подписчиков
            </div>
            <div className="flex items-center bg-secondary/50 px-3 py-1 rounded-full">
              <PlaySquare className="h-4 w-4 mr-2" />
              <span className="font-semibold mr-1">
                {stats.total_videos}
              </span>{" "}
              видео
            </div>
            <div className="flex items-center bg-secondary/50 px-3 py-1 rounded-full">
              <Eye className="h-4 w-4 mr-2" />
              <span className="font-semibold mr-1">
                {stats.total_views}
              </span>{" "}
              просмотров
            </div>
            <div className="flex items-center text-muted-foreground ml-auto">
              <Calendar className="h-4 w-4 mr-2" />
              На YouTube с {formatDate(stats.registration_date)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
