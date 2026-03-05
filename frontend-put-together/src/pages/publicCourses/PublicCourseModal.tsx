import type { PublicCourseCard } from "../../types/course";

type PublicCourseModalProps = {
  course: PublicCourseCard | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function PublicCourseModal({
  course,
  isOpen,
  onClose,
}: PublicCourseModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-lila-100 px-3 py-1 text-xs font-bold text-lila-700">
                {course.level}
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {course.publishedLessonCount}{" "}
                {course.publishedLessonCount === 1 ? "Lektion" : "Lektionen"}
              </span>
              {course.price !== null && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  €{course.price}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {course.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">
              {course.description || "Keine Beschreibung verfügbar."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Schließen
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {course.lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-gray-500">
                Keine veröffentlichten Lektionen verfügbar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {lesson.thumbnailUrl ? (
                      <img
                        src={lesson.thumbnailUrl}
                        alt={lesson.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        Kein Thumbnail
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                      Lektion {index + 1}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900">
                      {lesson.title}
                    </h3>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-600">
                      {lesson.content || "Keine Beschreibung verfügbar."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}