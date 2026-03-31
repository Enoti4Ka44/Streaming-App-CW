export interface Subscriptions {
  user_id: number;
  username: string;
  channel_description: string | null;
  sub_count: number;
}

export interface ChannelStats {
  username: string;
  country: string;
  registration_date: Date;
  channel_description: string | null;
  subscribers_count: number;
  total_videos: number;
  total_views: number;
}
