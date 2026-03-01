import type { DisplayLessonProps } from "./typeDisplayLesson";
import { DisplayLessonVideo } from "./DisplayLessonVideo";
import { DisplayLessonContent } from "./DisplayLessonContent";
import { DisplayFileDocuments } from "../lessonFileDocuments/DisplayFileDocuments";
import { downloadFileDocumentsByFileIdAndLessonId } from "../../../services/fileDocumentService";

export const DisplayLesson = ({ selectedLesson }: DisplayLessonProps) => {
  async function loadDowndloadFile(lessonId: string, fileId: string) {
    const data = await downloadFileDocumentsByFileIdAndLessonId(
      fileId,
      lessonId,
    );
    return data;
  }

  async function handleDownloadFileDocument(fileId: string) {
    if (!selectedLesson?.id) return;

    const lessonId = selectedLesson.id.toString();

    const fileUrl = await loadDowndloadFile(lessonId, fileId);

    window.open(fileUrl.url, "_blank");
  }

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

  const hasVideo = selectedLesson.videoLibraryId && selectedLesson.videoGuid;
  const fileDocuments = selectedLesson.fileDocuments ?? [];

  return (
    <section className="lg:col-span-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* VIDEO */}
        {hasVideo && (
          <DisplayLessonVideo
            videoLibraryId={selectedLesson.videoLibraryId!}
            videoGuid={selectedLesson.videoGuid!}
          />
        )}

        {/* CONTENT */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DisplayLessonContent
                title={selectedLesson.title}
                content={selectedLesson.content}
              />
            </div>
          </div>
        </div>

        {fileDocuments.length > 0 && (
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-gray-800">
                Materialien
              </h2>
            </div>

            <div className="space-y-2">
              <DisplayFileDocuments
                fileDocuments={fileDocuments}
                onClickSelectedFileIdToDowndload={handleDownloadFileDocument}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
