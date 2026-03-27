import { getMyVideos, getChannelStats } from "@/actions/studioActions";
import { getCurrentUserId } from "@/actions/authActions";
import StudioVideoList from "@/components/studio-video-list";
import StudioHeader from "@/components/studio-header";
import { redirect } from "next/navigation";

export default async function StudioPage() {
  const userId = await getCurrentUserId();

  if (!userId) redirect("/");

  const [myVideos, stats] = await Promise.all([
    getMyVideos(),
    getChannelStats(),
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
      <StudioHeader stats={stats} />
      <StudioVideoList initialVideos={myVideos} />
    </div>
  );
}
