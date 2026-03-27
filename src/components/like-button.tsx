"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { toggleLike } from "@/actions/videoActions";

interface LikeButtonProps {
  videoId: number;
  initialLikes: number;
  initialIsLiked: boolean;
}

export default function LikeButton({
  videoId,
  initialLikes,
  initialIsLiked,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike(videoId);
    } catch (error) {
      setIsLiked(initialIsLiked);
      setLikesCount(initialLikes);
      console.error("Ошибка при постановке лайка", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isLiked ? "default" : "secondary"}
      className="rounded-full font-semibold"
      onClick={handleLike}
      disabled={isLoading}
    >
      <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      {likesCount}
    </Button>
  );
}
