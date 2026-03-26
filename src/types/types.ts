export interface User {
  user_id: number;
  username: string;
  email: string;
  channel_description?: string;
  created_at: Date;
}

export interface Video {
  video_id: number;
  author_id: number;
  title: string;
  description?: string;
  video_type: "video" | "shorts";
  url: string;
  thumbnail_url?: string;
  views_count: number;
  created_at: Date;
}

export interface Like {
  like_id: number;
  user_id: number;
  video_id: number;
  created_at: Date;
}

export interface Subscription {
  subscriber_id: number;
  channel_id: number;
  subscribed_at: Date;
}

export interface SubscriptionPlan {
  plan_id: number;
  name: string;
  price: number;
  max_quality: string;
}

export interface UserSubscription {
  user_id: number;
  plan_id: number;
  start_date: Date;
  end_date: Date;
}

export interface VideoWithAuthor extends Video {
  author_username: string;
}

export interface UserSubscriptionDetails extends UserSubscription {
  plan_name: string;
  plan_price: number;
  max_quality: string;
}
