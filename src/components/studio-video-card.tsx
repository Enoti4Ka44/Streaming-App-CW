import { MoreVertical, Pencil, Play, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { Video } from "@/types/video";

type StudioVideoCardProps = {
  video: Video;
  handleOpenEdit: (video: Video) => void;
  handleDelete: (id: number) => void;
};

const StudioVideoCard = ({
  video,
  handleDelete,
  handleOpenEdit,
}: StudioVideoCardProps) => {
  return (
    <div className="group flex flex-col relative border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 bg-card">
      <Link
        href={`/video/${video.video_id}`}
        className="aspect-video bg-secondary relative flex items-center justify-center"
      >
        <Play className="h-10 w-10 text-muted-foreground transition-transform group-hover:scale-110" />

        <span
          className={`absolute top-2 left-2 ${video.video_type === "shorts" ? "bg-red-600" : "bg-black"} text-white text-[10px] font-bold px-2 py-1 rounded-md`}
        >
          {video.video_type.toUpperCase()}
        </span>

        <span
          className={`absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5  rounded`}
        >
          {video.duration ? video.duration + "s" : "-"}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3
            className="font-semibold text-sm line-clamp-2"
            title={video.title}
          >
            {video.title}
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-6 w-6 p-0 flex-shrink-0 -mr-2 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => handleOpenEdit(video)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" /> Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(video.video_id)}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col mt-auto text-xs text-muted-foreground gap-1">
          <div className="flex justify-between items-center">
            <span>{video.views_count} просмотров</span>
            <span>
              {new Date(video.created_at).toLocaleDateString("ru-RU")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioVideoCard;
