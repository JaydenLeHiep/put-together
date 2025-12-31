import {useState} from "react";
import {useLessons} from "../contexts/LessonContext";
import type {Lesson} from "../types/lesson";

export default function CoursePage() {
    const {lessons, loading} = useLessons();

    const [selected, setSelected] = useState<Lesson | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    if (!selected && lessons.length > 0) {
        setSelected(lessons[0]);
    }

    const filteredLessons = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getLessonNumber = (index: number) => {
        return String(index + 1).padStart(2, "0");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lila-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Lektionen werden geladen...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar - Lesson List */}
            <aside className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Sidebar Header */}
                    <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Kursinhalte</h2>
                        <p className="text-lila-100 text-sm">
                            {lessons.length} {lessons.length === 1 ? "Lektion" : "Lektionen"} verfügbar
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Lektionen durchsuchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-lila-500 focus:outline-none transition-colors"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Lesson List */}
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                        {filteredLessons.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p>Keine Lektionen gefunden</p>
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
                                    <div className="flex items-start space-x-3">
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                                                selected?.id === lesson.id
                                                    ? "bg-lila-600 text-white"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {getLessonNumber(index)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className={`font-semibold mb-1 line-clamp-2 ${
                                                    selected?.id === lesson.id
                                                        ? "text-lila-800"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {lesson.title}
                                            </h3>
                                            {lesson.content && (
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {lesson.content}
                                                </p>
                                            )}
                                        </div>
                                        {selected?.id === lesson.id && (
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-lila-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Progress Card */}
                <div className="bg-gradient-to-br from-lila-600 to-lila-700 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="font-semibold mb-2">Ihr Fortschritt</h3>
                    <div className="flex items-end space-x-2 mb-3">
                        <span className="text-4xl font-bold">0</span>
                        <span className="text-lila-200 mb-1">/ {lessons.length} abgeschlossen</span>
                    </div>
                    <div className="w-full bg-lila-800 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{width: "0%"}}></div>
                    </div>
                </div>
            </aside>

            {/* Main Content - Video Player */}
            <section className="lg:col-span-8 space-y-6">
                {!selected ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <svg
                            className="w-20 h-20 mx-auto mb-4 text-lila-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <p className="text-gray-500 text-lg">
                            Wählen Sie eine Lektion aus, um zu beginnen
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Video Player Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Video */}
                            <div className="relative bg-black aspect-video">
                                {!isPlaying ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button
                                            onClick={() => setIsPlaying(true)}
                                            className="group"
                                        >
                                            <div
                                                className="w-20 h-20 bg-lila-600 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-lila-700 transition-all group-hover:scale-110">
                                                <svg
                                                    className="w-10 h-10 text-white ml-1"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                ) : null}
                                <iframe
                                    src={`https://iframe.mediadelivery.net/embed/${selected.videoLibraryId}/${selected.videoGuid}?autoplay=${isPlaying ? 'true' : 'false'}`}
                                    loading="lazy"
                                    className="w-full h-full"
                                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Video Info */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {selected.title}
                                        </h1>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Video-Lektion
                      </span>
                                            <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                                                {lessons.findIndex(l => l.id === selected.id) + 1} / {lessons.length}
                      </span>
                                        </div>
                                    </div>
                                    <button
                                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-3 mb-6">
                                    <button
                                        className="flex-1 bg-lila-600 text-white py-3 rounded-xl font-semibold hover:bg-lila-700 transition-colors flex items-center justify-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                        <span>Als abgeschlossen markieren</span>
                                    </button>
                                    <button
                                        className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-lila-500 hover:text-lila-600 transition-colors flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                        </svg>
                                        <span>Teilen</span>
                                    </button>
                                </div>

                                {/* Content/Description */}
                                {selected.content && (
                                    <div className="border-t pt-6">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-lila-600" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                            </svg>
                                            Lektionsbeschreibung
                                        </h3>
                                        <div
                                            className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-4">
                                            {selected.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    const currentIndex = lessons.findIndex(l => l.id === selected.id);
                                    if (currentIndex > 0) {
                                        setSelected(lessons[currentIndex - 1]);
                                        setIsPlaying(false);
                                    }
                                }}
                                disabled={lessons.findIndex(l => l.id === selected.id) === 0}
                                className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M15 19l-7-7 7-7"/>
                                </svg>
                                <span className="font-semibold">Vorherige Lektion</span>
                            </button>

                            <button
                                onClick={() => {
                                    const currentIndex = lessons.findIndex(l => l.id === selected.id);
                                    if (currentIndex < lessons.length - 1) {
                                        setSelected(lessons[currentIndex + 1]);
                                        setIsPlaying(false);
                                    }
                                }}
                                disabled={lessons.findIndex(l => l.id === selected.id) === lessons.length - 1}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-lila-600 to-lila-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                            >
                                <span className="font-semibold">Nächste Lektion</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}