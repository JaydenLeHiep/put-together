import { useEffect, useState } from "react";
import { getPublishedLessons } from "../../services/lessonService";
import type { Lesson } from "../../types/Lesson";

export default function AdminProductCoursesPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublishedLessons(); 
        setLessons(data);
        setSelected(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setIsPlaying(false);
  }, [selected?.id]);

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLessonNumber = (index: number) =>
    String(index + 1).padStart(2, "0");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lila-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Veröffentlichte Kurse werden geladen…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Produkt-Kurse
            </h2>
            <p className="text-lila-100 text-sm">
              {lessons.length} veröffentlichte Kurse
            </p>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Kurse durchsuchen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-lila-500"
            />
          </div>

          {/* List */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredLessons.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Keine veröffentlichten Kurse
              </div>
            ) : (
              filteredLessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelected(lesson);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-4 border-b transition-all hover:bg-lila-50 ${
                    selected?.id === lesson.id
                      ? "bg-lila-100 border-l-4 border-lila-600"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        selected?.id === lesson.id
                          ? "bg-lila-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getLessonNumber(index)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2">
                        {lesson.title}
                      </h3>
                      <span className="inline-block mt-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        Veröffentlicht
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <section className="lg:col-span-8 space-y-6">
        {!selected ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              Wählen Sie einen Produkt-Kurs aus
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
            {/* Published badge */}
            <span className="absolute top-4 right-4 z-10 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Veröffentlicht
            </span>

            {/* Video */}
            <div className="relative bg-black aspect-video">
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 bg-lila-600 rounded-full flex items-center justify-center text-white text-3xl"
                  >
                    ▶
                  </button>
                </div>
              )}

              {isPlaying && (
                <iframe
                  key={`${selected.videoLibraryId}:${selected.videoGuid}`}
                  src={`https://iframe.mediadelivery.net/embed/${selected.videoLibraryId}/${selected.videoGuid}?autoplay=true`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>

            {/* Info */}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">
                {selected.title}
              </h1>

              {selected.content && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                  {selected.content}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}