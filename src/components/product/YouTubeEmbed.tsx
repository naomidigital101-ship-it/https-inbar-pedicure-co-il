type Props = {
  youtubeId: string;
  title: string;
};

export function YouTubeEmbed({ youtubeId, title }: Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden border border-[#222] bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}