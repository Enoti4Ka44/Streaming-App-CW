"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createVideo, updateVideo, deleteVideo } from "@/actions/studioActions";
import { Video } from "@/types/types";
import StudioVideoCard from "./studio-video-card";

export default function StudioVideoList({
  initialVideos,
}: {
  initialVideos: Video[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingVideo(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (video: any) => {
    setEditingVideo(video);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (editingVideo) {
        await updateVideo(editingVideo.video_id, formData);
      } else {
        await createVideo(formData);
      }
      setIsOpen(false);
    } catch (error) {
      alert("Произошла ошибка при сохранении");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (videoId: number) => {
    if (confirm("Вы уверены, что хотите удалить видео?")) {
      await deleteVideo(videoId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Контент канала</h2>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate} className="rounded-full">
              <Plus className="mr-2 h-4 w-4" /> Добавить видео
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? "Редактировать видео" : "Загрузить видео"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input
                  name="title"
                  required
                  defaultValue={editingVideo?.title}
                  placeholder="Введите название..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  name="description"
                  rows={4}
                  defaultValue={editingVideo?.description}
                  placeholder="Расскажите о чем видео..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  URL Видео (mp4/youtube)
                </label>
                <Input
                  name="video_url"
                  required
                  defaultValue={editingVideo?.video_url}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип видео</label>
                <Select
                  name="video_type"
                  defaultValue={editingVideo?.video_type || "video"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Обычное видео</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {initialVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">Нет загруженных видео</p>
          <p className="text-sm text-muted-foreground mt-1">
            Загрузите свое первое видео прямо сейчас.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {initialVideos.map((video) => (
            <StudioVideoCard
              key={video.video_id}
              video={video}
              handleDelete={handleDelete}
              handleOpenEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
