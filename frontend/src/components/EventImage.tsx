interface EventImageProps {
  imageUrl?: string | null;
  title?: string | null;
}

// NOTE: Dedicated hero visual for event details.
export default function EventImage({ imageUrl, title }: EventImageProps) {
  const altText = title ? `${title} hero image` : "Event hero image";

  if (!imageUrl) {
    return (
      <div className="flex h-[700px] w-full items-center justify-center rounded-2xl bg-muted text-lg font-semibold text-muted-foreground">
        Image coming soon
      </div>
    );
  }

  return (
    <div className="h-[700px] w-full overflow-hidden rounded-3xl">
      <img
        src={imageUrl}
        alt={altText}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
