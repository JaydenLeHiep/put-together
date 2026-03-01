import type { LessonComment } from "../../../types/lessonComment";

type AdminCoursesCommentsProps = {
  selectedLessonId: string | null;
  comments: LessonComment[];
  loadingComments: boolean;
  newComment: string;
  userInitial: string;
  onNewCommentChange: (value: string) => void;
  onSubmitComment: () => void;
};

export default function AdminCoursesComments({
  selectedLessonId,
  comments,
  loadingComments,
  newComment,
  userInitial,
  onNewCommentChange,
  onSubmitComment,
}: AdminCoursesCommentsProps) {
  if (!selectedLessonId) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="w-6 h-6 text-lila-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="text-xl font-bold text-gray-900">Kommentare</h3>
        <span className="text-sm text-gray-500">({comments.length})</span>
      </div>

      {loadingComments ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lila-600" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Noch keine Kommentare vorhanden</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => {
            const initial = (comment.authorName?.[0] ?? "?").toUpperCase();

            return (
              <div key={comment.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lila-500 to-lila-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                  {initial}
                </div>

                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl px-4 py-3">
                    <p className="font-semibold text-sm text-gray-900">
                      {comment.authorName}
                    </p>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 ml-4">
                    {new Date(comment.createdAt).toLocaleString("de-DE")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-gray-100 pt-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lila-500 to-lila-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
            {userInitial}
          </div>

          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => onNewCommentChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Schreiben Sie einen Kommentar..."
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={onSubmitComment}
                disabled={!newComment.trim()}
                className="bg-lila-600 hover:bg-lila-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Kommentar posten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}