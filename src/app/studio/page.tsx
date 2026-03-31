import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getMyVideos,
  getChannelStats,
  getMySubscriptions,
  getWatchHistory,
  getLikedVideos,
} from "@/actions/studioActions";
import { getCurrentUserId } from "@/actions/authActions";
import StudioHeader from "@/components/studio-header";
import StudioVideoList from "@/components/studio-video-list";
import VideoGridSimple from "@/components/video-grid-simple";
import { redirect } from "next/navigation";
import { Video, Users, History, Heart } from "lucide-react";
import ChannelCard from "@/components/channel-card";

export default async function StudioPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/");

  const [myVideos, stats, subscriptions, watchHistory, likedVideos] =
    await Promise.all([
      getMyVideos(),
      getChannelStats(),
      getMySubscriptions(),
      getWatchHistory(),
      getLikedVideos(),
    ]);

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
      <StudioHeader stats={stats} />

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Мои видео</span>
          </TabsTrigger>
          <TabsTrigger value="subs" className="flex items-center gap-2">
            <Users className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Подписки</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">История</span>
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Понравившиеся</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <StudioVideoList initialVideos={myVideos} />
        </TabsContent>

        <TabsContent value="subs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <ChannelCard
                  key={sub.user_id}
                  author_id={sub.user_id}
                  author_username={sub.username}
                  subCount={sub.sub_count}
                  isSubscribed={true}
                />
              ))
            ) : (
              <p className="col-span-full text-center py-10 text-muted-foreground">
                Вы пока ни на кого не подписаны
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <VideoGridSimple
            videos={watchHistory}
            emptyText="История просмотров пуста"
          />
        </TabsContent>

        <TabsContent value="liked">
          <VideoGridSimple
            videos={likedVideos}
            emptyText="Вы еще не ставили лайки видео"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
