export interface Video {
  video_id: number;
  author_id: number;
  title: string;
  description: string;
  duration: number;
  video_url: string;
  video_type: string;
  created_at: Date;
  views_count: number;
  author_username: string;
  country?: string;
  watched_at?: Date;
  liked_at?: Date;
}

export type CreateVideoDto = Omit<
  Video,
  "video_id" | "created_at" | "views_count" | "author_username"
>;
export type UpdateVideoDto = Partial<CreateVideoDto>;

export interface LikeStatus {
  likesCount: number;
  isLiked: boolean;
}
