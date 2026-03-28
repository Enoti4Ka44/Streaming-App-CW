import SubscribeButton from "./subscribe-button";
import { Avatar, AvatarFallback } from "./ui/avatar";

type ChannelCardProps = {
  author_id: number;
  author_username: string;
  subCount: number;
  isSubscribed: boolean;
};

const ChannelCard = ({
  author_id,
  author_username,
  subCount,
  isSubscribed,
}: ChannelCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{author_username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{author_username}</span>
          <span className="text-xs text-muted-foreground">
            {subCount} подписчиков
          </span>
        </div>
        <SubscribeButton
          authorId={author_id}
          initialIsSubscribed={isSubscribed}
        />
      </div>
    </div>
  );
};

export default ChannelCard;
