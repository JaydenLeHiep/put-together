import { useEffect, useRef, useState } from "react";
import type { DisplayLessonVideoProps } from "./typeDisplayLessonVideo";

export const DisplayLessonVideo = ({
  videoLibraryId,
  videoGuid,
  thumbnailUrl,
  showVideo = true,
}: DisplayLessonVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHoverPreviewing, setIsHoverPreviewing] = useState(false);

  const hoverTimerRef = useRef<number | null>(null);

  const showFullPlayer = showVideo && isPlaying;
  const showHoverPlayer = showVideo && !isPlaying && isHoverPreviewing;
  const showThumbnail = !showFullPlayer && !showHoverPlayer;

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  function handleMouseEnter() {
    if (!showVideo || isPlaying) return;

    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }

    setIsHoverPreviewing(true);

    hoverTimerRef.current = window.setTimeout(() => {
      setIsHoverPreviewing(false);
    }, 7000);
  }

  function handleMouseLeave() {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }

    setIsHoverPreviewing(false);
  }

  function handlePlayClick() {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }

    setIsHoverPreviewing(false);
    setIsPlaying(true);
  }

  return (
    <div
      className="relative bg-black aspect-video group overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!showVideo && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white z-10">
          Anmelden um dieses Video zu schauen
        </div>
      )}

      {showThumbnail && thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {showThumbnail && !thumbnailUrl && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Kein Thumbnail verfügbar
        </div>
      )}

      {showThumbnail && showVideo && (
        <button
          type="button"
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl group-hover:bg-lila-600 transition-colors duration-300">
            ▶
          </div>
        </button>
      )}

      {showHoverPlayer && (
        <iframe
          key={`hover-${videoGuid}`}
          src={`https://iframe.mediadelivery.net/embed/${videoLibraryId}/${videoGuid}?autoplay=true&muted=true`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
        />
      )}

      {showFullPlayer && (
        <iframe
          key={`full-${videoGuid}`}
          src={`https://iframe.mediadelivery.net/embed/${videoLibraryId}/${videoGuid}?autoplay=true`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
};