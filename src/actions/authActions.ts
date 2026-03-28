"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { query } from "@/utils/db";
import { User } from "@/types/user";

export async function getAllUsers(): Promise<User[]> {
  const res = await query<User>("SELECT * FROM users ORDER BY username ASC");
  return res.rows;
}

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("current_user_id")?.value;
  return userId ? parseInt(userId, 10) : null;
}

export async function loginAsUser(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set("current_user_id", userId.toString(), { path: "/" });
  revalidatePath("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("current_user_id");
  revalidatePath("/");
}
