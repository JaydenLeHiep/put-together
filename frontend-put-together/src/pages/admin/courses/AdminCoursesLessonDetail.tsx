import { DisplayLessonVideo } from "../../../components/displayComponents/lesson/DisplayLessonVideo";
import { DisplayFileDocuments } from "../../../components/displayComponents/lessonFileDocuments/DisplayFileDocuments";
import type { FileDocument } from "../../../components/displayComponents/lessonFileDocuments/typeDisplayFileDocuments";
import type { LessonInCourse } from "../../../types/course";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

type AdminCoursesLessonDetailProps = {
  selectedLesson: LessonInCourse | null;
  canEditLesson: boolean;
  fileDocuments: FileDocument[];
  onDownloadFile: (fileId: string) => void;
  onPublish: () => void;
  onDelete: () => void;
};

export default function AdminCoursesLessonDetail({
  selectedLesson,
  canEditLesson,
  fileDocuments,
  onDownloadFile,
  onPublish,
  onDelete,
}: AdminCoursesLessonDetailProps) {
  const navigate = useNavigate();

  const handleEditLesson = () => {
    navigate(`/admin/lessons/${selectedLesson?.id}/edit`);
  };

  if (!selectedLesson) {
    return (
      <section className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Keine Lektion ausgewählt
            </h3>
            <p className="text-gray-500">
              Wählen Sie eine Lektion aus der Liste, um sie anzusehen
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {!!selectedLesson.videoLibraryId && !!selectedLesson.videoGuid && (
          <DisplayLessonVideo
            videoLibraryId={selectedLesson.videoLibraryId}
            videoGuid={selectedLesson.videoGuid}
            thumbnailUrl={selectedLesson.thumbnailUrl}
          />
        )}

        <div className="p-6 border-b border-gray-100">
          {/* HEADER ROW (title left, buttons right) */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {selectedLesson.title}
            </h1>

            {canEditLesson && (
              <div className="shrink-0 flex gap-2">
                <button
                  onClick={handleEditLesson}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm"
                >
                  <Pencil className="w-5 h-5" />
                  Updaten
                </button>

                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Löschen
                </button>

                {!selectedLesson.isPublished && (
                  <button
                    onClick={onPublish}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Veröffentlichen
                  </button>
                )}
              </div>
            )}
          </div>

          {/* META ROW */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-10">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>

            <span className="w-1 h-1 bg-gray-300 rounded-full" />

            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${selectedLesson.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {selectedLesson.isPublished ? "Veröffentlicht" : "Entwurf"}
            </span>
          </div>

          {/* CONTENT ROW (full width, below buttons) */}
          {selectedLesson.content && (
            <div
              className="mt-4 ck-content prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
            />
          )}

          {/* FILES */}
          <div className="mt-6">
            <DisplayFileDocuments
              fileDocuments={fileDocuments}
              onClickSelectedFileIdToDowndload={onDownloadFile}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
