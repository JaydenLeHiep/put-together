import { useState } from "react";
import type { DisplayLessonVideoProps } from "./typeDisplayLessonVideo";

export const DisplayLessonVideo = ({
  videoLibraryId,
  videoGuid,
}: DisplayLessonVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative bg-black aspect-video group overflow-hidden">
      {/* Play Overlay */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-black/20"
        >
          <div className="w-20 h-20 bg-lila-600 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <svg
              className="w-8 h-8 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Video Iframe */}
      {isPlaying && (
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${videoLibraryId}/${videoGuid}?autoplay=true`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
};
