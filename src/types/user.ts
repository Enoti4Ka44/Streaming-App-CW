export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  country: string;
  channel_description: string | null;
  created_at: Date;
}

export type CreateUserDto = Omit<User, "user_id" | "created_at">;
export type UpdateUserDto = Partial<CreateUserDto>;
