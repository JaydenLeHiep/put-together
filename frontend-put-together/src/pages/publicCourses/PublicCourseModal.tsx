import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { PublicCourseCard } from "../../types/course";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";

type PublicCourseModalProps = {
  course: PublicCourseCard | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called to open the CartDrawer after a course is added */
  onCartOpen?: () => void;
};

const levelColors: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  A1: { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  A2: { dot: "bg-teal-400", text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
  B1: { dot: "bg-sky-400", text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  B2: { dot: "bg-violet-400", text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  C1: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  C2: { dot: "bg-rose-400", text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
};

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

export default function PublicCourseModal({
  course,
  isOpen,
  onClose,
  onCartOpen,
}: PublicCourseModalProps) {
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const lc = levelColors[course.level] ?? {
    dot: "bg-lila-400", text: "text-lila-700", bg: "bg-lila-50", border: "border-lila-200",
  };

  const inCart = isInCart(course.id);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      onClose();
      navigate("/login", { state: { from: "/alle-kurse" } });
      return;
    }
    if (inCart) {
      onClose();
      onCartOpen?.();
    } else {
      addToCart(course);
      onCartOpen?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-lila-950/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal shell */}
      <div
        className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl shadow-lila-900/20"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
        <div className="relative flex-shrink-0 overflow-hidden bg-lila-700 px-8 pt-8 pb-7 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lila-400 opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-lila-800/40 to-transparent" />

          <div className="relative flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className={`flex items-center gap-1.5 rounded-lg border ${lc.border} ${lc.bg} px-2.5 py-1`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${lc.dot}`} />
                  <span className={`text-xs font-bold ${lc.text}`}>{course.level}</span>
                </div>
                <span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80">
                  {course.publishedLessonCount}{" "}
                  {course.publishedLessonCount === 1 ? "Lektion" : "Lektionen"}
                </span>
                {course.price !== null && (
                  <span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-white/90">
                    €{course.price}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
                {course.title}
              </h2>

              {/* Description */}
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                {course.description || "Keine Beschreibung verfügbar."}
              </p>

              {/* ── Add to Cart button ── */}
              <div className="mt-5">
                {!isAuthenticated ? (
                  <button
                    onClick={handleCartClick}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
                  >
                    <LockIcon />
                    Anmelden &amp; kaufen
                  </button>
                ) : inCart ? (
                  <button
                    onClick={handleCartClick}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-lila-700 shadow-lg transition hover:bg-lila-50"
                  >
                    <CheckIcon />
                    Im Warenkorb · Zur Kasse
                  </button>
                ) : (
                  <button
                    onClick={handleCartClick}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-lila-700 shadow-lg transition hover:bg-lila-50"
                  >
                    <CartIcon />
                    In den Warenkorb
                  </button>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* ── Lessons body ── */}
        <div className="flex-1 overflow-y-auto bg-lila-50/30 p-6">
          {course.lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-lila-200 bg-white px-6 py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-lila-50 text-lila-400">
                <PlayIcon />
              </div>
              <p className="text-sm font-semibold text-gray-600">Keine Lektionen verfügbar</p>
              <p className="mt-1 text-xs text-gray-400">
                Für diesen Kurs wurden noch keine Lektionen veröffentlicht.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-lila-400">
                {course.lessons.length} {course.lessons.length === 1 ? "Lektion" : "Lektionen"}
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="group overflow-hidden rounded-2xl border border-lila-100 bg-white shadow-sm transition-all duration-200 hover:border-lila-200 hover:shadow-md hover:shadow-lila-100/50"
                  >
                    {/* Lesson thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-lila-50">
                      {lesson.thumbnailUrl ? (
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-lila-50 to-purple-50">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-lila-300">
                            <PlayIcon />
                          </div>
                          <span className="text-xs text-lila-400">Kein Thumbnail</span>
                        </div>
                      )}
                      {/* Lesson number badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-lila-700/80 px-2.5 py-1 backdrop-blur-sm">
                        <span className="text-xs font-bold text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Lesson info */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lila-100 text-lila-700 text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold leading-snug text-gray-900">
                            {lesson.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-gray-500">
                            {lesson.content || "Keine Beschreibung verfügbar."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}