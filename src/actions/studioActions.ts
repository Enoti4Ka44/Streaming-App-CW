"use server";

import { query } from "@/utils/db";
import { getCurrentUserId } from "@/actions/authActions";
import { revalidatePath } from "next/cache";

export async function getChannelStats() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const sql = `
    SELECT 
      u.username,
      u.created_at as registration_date,
      u.channel_description,
      (SELECT COUNT(*) FROM subscriptions WHERE user_id = $1) as subscribers_count,
      (SELECT COUNT(*) FROM videos WHERE author_id = $1) as total_videos,
      (SELECT COALESCE(SUM(views_count), 0) FROM videos WHERE author_id = $1) as total_views
    FROM users u
    WHERE u.user_id = $1
  `;

  try {
    const result = await query<any>(sql, [userId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    return null;
  }
}

export async function getMyVideos() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const sql = `
    SELECT * FROM videos 
    WHERE author_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await query<any>(sql, [userId]);
  return result.rows;
}

export async function createVideo(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Не авторизован");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const video_url = formData.get("video_url") as string;
  const video_type = formData.get("video_type") as string;

  const sql = `
    INSERT INTO videos (author_id, title, description, video_url, video_type, created_at, views_count)
    VALUES ($1, $2, $3, $4, $5, NOW(), 0)
  `;

  await query(sql, [userId, title, description, video_url, video_type]);

  revalidatePath("/studio");
  revalidatePath("/", "layout");
}

export async function updateVideo(videoId: number, formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Не авторизован");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const video_url = formData.get("video_url") as string;
  const video_type = formData.get("video_type") as string;

  const sql = `
    UPDATE videos 
    SET title = $1, description = $2, video_url = $3, video_type = $4
    WHERE video_id = $5 AND author_id = $6
  `;

  await query(sql, [
    title,
    description,
    video_url,
    video_type,
    videoId,
    userId,
  ]);
  revalidatePath("/studio");
  revalidatePath("/", "layout");
}

export async function deleteVideo(videoId: number) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Не авторизован");

  const checkSql = `SELECT 1 FROM videos WHERE video_id = $1 AND author_id = $2`;
  const check = await query(checkSql, [videoId, userId]);

  if (check.rows.length === 0) throw new Error("Видео не найдено или нет прав");

  await query(`DELETE FROM likes WHERE video_id = $1`, [videoId]);
  await query(`DELETE FROM views WHERE video_id = $1`, [videoId]);
  await query(`DELETE FROM watch_history WHERE video_id = $1`, [videoId]);
  await query(`DELETE FROM videos WHERE video_id = $1`, [videoId]);

  revalidatePath("/studio");
  revalidatePath("/", "layout");
}
