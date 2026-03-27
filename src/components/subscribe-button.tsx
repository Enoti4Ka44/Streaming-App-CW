"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleSubscription } from "@/actions/videoActions";
import { useRouter } from "next/navigation";

export default function SubscribeButton({
  authorId,
  initialIsSubscribed,
}: {
  authorId: number;
  initialIsSubscribed: boolean;
}) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const router = useRouter();

  const handleToggle = async () => {
    setIsSubscribed(!isSubscribed);

    try {
      await toggleSubscription(authorId);
      router.refresh();
    } catch (err) {
      setIsSubscribed(initialIsSubscribed);
      alert("Ошибка при подписке");
    }
  };

  return (
    <Button
      variant={isSubscribed ? "secondary" : "default"}
      className="rounded-full ml-4 font-semibold"
      onClick={handleToggle}
    >
      {isSubscribed ? "Вы подписаны" : "Подписаться"}
    </Button>
  );
}
