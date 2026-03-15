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

  // show hover preview only if not playing
  const showHoverPlayer = showVideo && !isPlaying && isHoverPreviewing;
  const showFullPlayer = showVideo && isPlaying;

  // Reset state when lesson/video changes
  useEffect(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsHoverPreviewing(false);
    setIsPlaying(false);
  }, [videoGuid, videoLibraryId]);

  // cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };
  }, []);

  function handleMouseEnter() {
    if (!showVideo || isPlaying) return;

    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    setIsHoverPreviewing(true);
    hoverTimerRef.current = window.setTimeout(() => {
      setIsHoverPreviewing(false);
      hoverTimerRef.current = null;
    }, 7000);
  }

  function handleMouseLeave() {
    // when full player is running, ignore mouse leave
    if (isPlaying) return;

    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsHoverPreviewing(false);
  }

  function handlePlayClick() {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsHoverPreviewing(false);
    setIsPlaying(true);
  }

  return (
    <div
      className="relative bg-black aspect-video overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Locked overlay */}
      {!showVideo && (
        <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center text-white">
          Anmelden um dieses Video zu schauen
        </div>
      )}

      {/* Always show a base image when not playing (so it’s never black) */}
      {!showFullPlayer && (
        thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/80">
            Kein Thumbnail verfügbar
          </div>
        )
      )}

      {/* Hover preview (7s) – on top of thumbnail */}
      {showHoverPlayer && (
        <iframe
          key={`hover-${videoGuid}`}
          src={`https://iframe.mediadelivery.net/embed/${videoLibraryId}/${videoGuid}?autoplay=true&muted=true`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      )}

      {/* Click-to-play overlay (only when not playing) */}
      {showVideo && !showFullPlayer && (
        <button
          type="button"
          onClick={handlePlayClick}
          className="absolute inset-0 z-30 flex items-center justify-center"
          aria-label="Video abspielen"
        >
          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl hover:bg-lila-600 transition-colors">
            ▶
          </div>
        </button>
      )}

      {/* Full player */}
      {showFullPlayer && (
        <iframe
          key={`full-${videoGuid}`}
          src={`https://iframe.mediadelivery.net/embed/${videoLibraryId}/${videoGuid}?autoplay=true`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};