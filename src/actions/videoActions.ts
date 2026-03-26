"use server";

import { VideoWithAuthor } from "@/types/types";
import { query } from "@/utils/db";

export async function getVideos(
  videoType: "video" | "shorts" = "video",
): Promise<VideoWithAuthor[]> {
  const sql = `
    SELECT 
      v.video_id,
      v.author_id,
      v.title,
      v.description,
      v.video_url,
      v.views_count,
      v.created_at,
      v.video_type,
      u.username as author_username
    FROM videos v
    JOIN users u ON v.author_id = u.user_id
    WHERE v.video_type = $1
    ORDER BY v.created_at DESC
  `;

  try {
    const result = await query<VideoWithAuthor>(sql, [videoType]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}
