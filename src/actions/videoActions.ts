"use server";

import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/actions/authActions";
import { LikeStatus, Video } from "@/types/video";

//Все видео (с фильтрами)
export async function getVideos(
  videoType: "video" | "shorts" = "video",
  country?: string,
  sort?: string,
  searchQuery?: string,
): Promise<Video[]> {
  let sql = `
    SELECT v.*, u.username as author_username, u.country as author_country
    FROM videos v
    JOIN users u ON v.author_id = u.user_id
    WHERE v.video_type = $1
  `;

  const params: any[] = [videoType];

  if (country && country !== "all") {
    params.push(country);
    sql += ` AND u.country = $${params.length}`;
  }

  if (searchQuery) {
    params.push(`%${searchQuery}%`);
    sql += ` AND (v.title ILIKE $${params.length} OR v.description ILIKE $${params.length})`;
  }

  if (sort === "oldest") {
    sql += ` ORDER BY v.created_at ASC`;
  } else {
    sql += ` ORDER BY v.created_at DESC`;
  }

  const result = await query<Video>(sql, params);
  return result.rows;
}

//Видео по ID
export async function getVideoById(
  videoId: number,
): Promise<Video | undefined> {
  const sql = `
    SELECT * FROM videos_with_authors
    WHERE video_id = $1
  `;

  const result = await query<Video>(sql, [videoId]);
  return result.rows[0];
}

//Лайкнуто видео пользователем или нет (+ кол-во лайков)
export async function getLikeStatus(videoId: number): Promise<LikeStatus> {
  const userId = await getCurrentUserId();

  const countSql = `SELECT COUNT(*) FROM likes WHERE video_id = $1`;

  if (!userId) {
    const countRes = await query<{ count: string }>(countSql, [videoId]);

    return {
      likesCount: Number(countRes.rows[0].count),
      isLiked: false,
    };
  }

  const statusSql = `
    SELECT 1 FROM likes 
    WHERE video_id = $1 AND user_id = $2
  `;

  const [countRes, statusRes] = await Promise.all([
    query<{ count: string }>(countSql, [videoId]),
    query(statusSql, [videoId, userId]),
  ]);

  return {
    likesCount: Number(countRes.rows[0].count),
    isLiked: statusRes.rows.length > 0,
  };
}

//Лайкнуть видео
export async function toggleLike(videoId: number) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Необходимо войти в аккаунт, чтобы ставить лайки");
  }

  const checkSql = `SELECT 1 FROM likes WHERE video_id = $1 AND user_id = $2`;
  const res = await query(checkSql, [videoId, userId]);

  if (res.rows.length > 0) {
    await query(`DELETE FROM likes WHERE video_id = $1 AND user_id = $2`, [
      videoId,
      userId,
    ]);
  } else {
    await query(
      `INSERT INTO likes (video_id, user_id, created_at) VALUES ($1, $2, NOW())`,
      [videoId, userId],
    );
  }
}

export async function recordView(videoId: number) {
  const userId = await getCurrentUserId();

  try {
    if (!userId) {
      await query(
        `UPDATE videos SET views_count = views_count + 1 WHERE video_id = $1`,
        [videoId],
      );
      return;
    }

    const viewSql = `
      INSERT INTO views (user_id, video_id, viewed_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, video_id) DO NOTHING
      RETURNING *
    `;
    const viewResult = await query(viewSql, [userId, videoId]);

    if (viewResult.rows.length > 0) {
      await query(
        `UPDATE videos SET views_count = views_count + 1 WHERE video_id = $1`,
        [videoId],
      );
    }

    const historySql = `
      INSERT INTO watch_history (user_id, video_id, watched_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, video_id) 
      DO UPDATE SET watched_at = NOW()
    `;
    await query(historySql, [userId, videoId]);
  } catch (error) {
    console.error("Критическая ошибка в recordView:", error);
  }
}

//Подписан на канал или нет (+ кол-во подписчиков)
export async function getSubStatus(
  authorId: number,
): Promise<{ subCount: number; isSubscribed: boolean }> {
  const userId = await getCurrentUserId();

  const countSql = `
    SELECT COUNT(*) as total 
    FROM subscriptions 
    WHERE channel_id = $1
  `;

  const checkSql = `
    SELECT 1 
    FROM subscriptions 
    WHERE subscriber_id = $1 AND channel_id = $2
  `;

  const [countRes, checkRes] = await Promise.all([
    query<{ total: string }>(countSql, [authorId]),
    userId ? query(checkSql, [userId, authorId]) : { rows: [] },
  ]);

  return {
    subCount: Number(countRes.rows[0].total),
    isSubscribed: checkRes.rows.length > 0,
  };
}

//Подписать на канал
export async function toggleSubscription(authorId: number) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Вы должны войти в аккаунт");
  if (userId === authorId) throw new Error("Нельзя подписаться на самого себя");

  const checkSql = `SELECT 1 FROM subscriptions WHERE subscriber_id = $1 AND channel_id = $2`;
  const res = await query(checkSql, [userId, authorId]);

  if (res.rows.length > 0) {
    await query(
      `DELETE FROM subscriptions WHERE subscriber_id = $1 AND channel_id = $2`,
      [userId, authorId],
    );
  } else {
    await query(
      `INSERT INTO subscriptions (subscriber_id, channel_id) VALUES ($1, $2)`,
      [userId, authorId],
    );
  }
}
