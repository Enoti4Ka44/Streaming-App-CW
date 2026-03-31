"use server";
import { User } from "@/types/user";
import { getCurrentUserId } from "./authActions";
import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

export async function getUserProfile(): Promise<User | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const sql = `SELECT * FROM users WHERE user_id = $1`;
  try {
    const result = await query<User>(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    return null;
  }
}

export async function updateUserProfile(formData: FormData): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Не авторизован");

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const country = formData.get("country") as string;
  const channel_description = formData.get("channel_description") as string;

  const sql = `
    UPDATE users 
    SET username = $1, email = $2, country = $3, channel_description = $4
    WHERE user_id = $5
  `;

  await query(sql, [username, email, country, channel_description, userId]);

  revalidatePath("/settings");
  revalidatePath("/", "layout");
}
