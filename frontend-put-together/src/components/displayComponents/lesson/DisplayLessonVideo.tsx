import { useState } from "react";
import type { DisplayLessonVideoProps } from "./typeDisplayLessonVideo";

export const DisplayLessonVideo = ({
  videoLibraryId,
  videoGuid,
  showVideo = true,
}: DisplayLessonVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const canPlay = showVideo && isPlaying;

  return (
    <div className="relative bg-black aspect-video group overflow-hidden">
      {!showVideo && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
          Anmelden um dieses Video zu schauen
        </div>
      )}

      {showVideo && !isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center text-white"
        >
          Play
        </button>
      )}

      {canPlay && (
        <iframe
          key={videoGuid}
          src={`https://iframe.mediadelivery.net/embed/${videoLibraryId}/${videoGuid}?autoplay=true`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
};
