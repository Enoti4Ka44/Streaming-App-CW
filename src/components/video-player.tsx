const VideoPlayer = ({ url }: { url: string }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 flex items-center justify-center relative">
      {url ? (
        <video controls className="w-full h-full object-contain bg-black">
          <source src={url} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      ) : (
        <p className="text-white text-xl">Видео не найдено</p>
      )}
    </div>
  );
};

export default VideoPlayer;
