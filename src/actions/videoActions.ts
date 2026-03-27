"use server";

import { VideoWithAuthor } from "@/types/types";
import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

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

const CURRENT_USER_ID = 1;

export async function getVideoDetails(videoId: number) {
  const sql = `
    SELECT v.*, u.username as author_username, u.user_id as author_id
    FROM videos v
    JOIN users u ON v.author_id = u.user_id
    WHERE v.video_id = $1
  `;
  const result = await query<any>(sql, [videoId]);
  return result.rows[0];
}

export async function getLikeStatus(videoId: number) {
  const countSql = `SELECT COUNT(*) FROM likes WHERE video_id = $1`;
  const statusSql = `SELECT 1 FROM likes WHERE video_id = $1 AND user_id = $2`;

  const [countRes, statusRes] = await Promise.all([
    query(countSql, [videoId]),
    query(statusSql, [videoId, CURRENT_USER_ID]),
  ]);

  return {
    likesCount: parseInt(countRes.rows[0].count, 10),
    isLiked: statusRes.rows.length > 0,
  };
}

export async function toggleLike(videoId: number) {
  const checkSql = `SELECT 1 FROM likes WHERE video_id = $1 AND user_id = $2`;
  const res = await query(checkSql, [videoId, CURRENT_USER_ID]);

  if (res.rows.length > 0) {
    await query(`DELETE FROM likes WHERE video_id = $1 AND user_id = $2`, [
      videoId,
      CURRENT_USER_ID,
    ]);
  } else {
    await query(
      `INSERT INTO likes (video_id, user_id, created_at) VALUES ($1, $2, NOW())`,
      [videoId, CURRENT_USER_ID],
    );
  }

  revalidatePath(`/video/${videoId}`);
}

export async function recordView(videoId: number) {
  const sql = `
    WITH inserted_view AS (
      INSERT INTO views (user_id, video_id, viewed_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, video_id) DO NOTHING
      RETURNING *
    )
    UPDATE videos 
    SET views_count = views_count + 1 
    WHERE video_id = $2 
      AND EXISTS (SELECT 1 FROM inserted_view);
  `;

  await query(sql, [CURRENT_USER_ID, videoId]);

  await query(
    `
    INSERT INTO watch_history (user_id, video_id, watched_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id, video_id) DO UPDATE SET watched_at = NOW()
  `,
    [CURRENT_USER_ID, videoId],
  );
}
