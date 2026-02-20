import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/editor.css";
import type { LessonComment } from "../../types/LessonComment";
import type { CourseWithLessons, LessonInCourse } from "../../types/Course";
import type { Category } from "../../types/Category";

import {
  getLessonComments,
  addLessonComment,
  publishLesson,
  deleteLesson,
} from "../../services/lessonService";

import {
  getAllCourses,
  getCourseWithLessons,
} from "../../services/courseService";
import { getAllCategories } from "../../services/categoryService";
import {
  getFileDocumentsByLessonId,
  downloadFileDocumentsByFileIdAndLessonId,
} from "../../services/fileDocumentService";
import Modal from "../../layout/Modal";

import { DisplayFileDocuments } from "../../components/displayComponents/lessonFileDocuments/DisplayFileDocuments";
import type { FileDocument } from "../../components/displayComponents/lessonFileDocuments/typeDisplayFileDocuments";

export default function AdminCoursesPage() {
  const { user } = useAuth();

  const [fileDocuments, setFileDocuments] = useState<FileDocument[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLesson, setSelectedLesson] = useState<LessonInCourse | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const [comments, setComments] = useState<LessonComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Dropdown state - now includes categories
  const [openStatus, setOpenStatus] = useState({
    draft: true,
    published: true,
  });
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const [openCourses, setOpenCourses] = useState<Record<string, boolean>>({});

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userInitial = useMemo(
    () => (user?.userName?.[0] ?? "?").toUpperCase(),
    [user?.userName],
  );

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [allCategories, allCourses] = await Promise.all([
          getAllCategories(),
          getAllCourses(),
        ]);

        const withLessons = await Promise.all(
          allCourses.map((c) => getCourseWithLessons(c.id)),
        );

        if (!cancelled) {
          setCategories(allCategories);
          setCourses(withLessons);
          setSelectedLesson(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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

  /* ===================== LOAD THING RELATED TO THE SELECTED LESSON ===================== */

  async function loadFileDocument(lessonId: string) {
    const data = await getFileDocumentsByLessonId(lessonId);
    setFileDocuments(data);
  }

  useEffect(() => {
    const id = selectedLesson?.id;
    if (!id) {
      setComments([]);
      setLoadingComments(false);
      setFileDocuments([]);
      return;
    }

    let cancelled = false;

    async function loadComments(lessonId: string) {
      setLoadingComments(true);
      try {
        const data = await getLessonComments(lessonId);
        if (!cancelled) setComments(data);
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    }

    loadComments(id);
    loadFileDocument(id);

    return () => {
      cancelled = true;
    };
  }, [selectedLesson?.id]);

  /* ===================== HELPERS ===================== */
  function lessonsByStatus(course: CourseWithLessons, published: boolean) {
    return course.lessons.filter((l) => l.isPublished === published);
  }

  function coursesByCategory(categoryId: string) {
    return courses.filter((c) => c.categoryId === categoryId);
  }

  const canEditLesson = useMemo(() => {
    if (!selectedLesson) return false;
    if (!user?.id) return false;
    return user.id === selectedLesson.createdById;
  }, [selectedLesson, user?.id]);

  async function submitComment() {
    const lessonId = selectedLesson?.id;
    if (!lessonId) return;

    const content = newComment.trim();
    if (!content) return;

    await addLessonComment(lessonId, { content });
    setNewComment("");

    // reload comments
    const updated = await getLessonComments(lessonId);
    setComments(updated);
  }

  async function handlePublish() {
    const lessonId = selectedLesson?.id;
    if (!lessonId) return;

    try {
      await publishLesson(lessonId);

      // Refresh courses to update the UI
      const allCourses = await getAllCourses();
      const withLessons = await Promise.all(
        allCourses.map((c) => getCourseWithLessons(c.id)),
      );
      setCourses(withLessons);

      // Update selected lesson
      if (selectedLesson) {
        setSelectedLesson({ ...selectedLesson, isPublished: true });
      }
    } catch (error) {
      console.error("Failed to publish lesson:", error);
    }
  }

  async function handleDeleteConfirm() {
    const lessonId = selectedLesson?.id;
    if (!lessonId) return;

    setIsDeleting(true);
    try {
      await deleteLesson(lessonId);

      // Refresh courses to update the UI
      const allCourses = await getAllCourses();
      const withLessons = await Promise.all(
        allCourses.map((c) => getCourseWithLessons(c.id)),
      );
      setCourses(withLessons);

      // Clear selected lesson
      setSelectedLesson(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lila-600" />
      </div>
    );
  }

  /* ===================== RENDER ===================== */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="lg:col-span-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
            <h2 className="text-xl font-bold text-white">Lektionen</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {/* ===== DRAFT ===== */}
            <Section
              title="Entwürfe"
              open={openStatus.draft}
              toggle={() => setOpenStatus((s) => ({ ...s, draft: !s.draft }))}
            >
              {categories.map((category) => {
                const categoryCourses = coursesByCategory(category.id);
                const hasLessons = categoryCourses.some(
                  (course) => lessonsByStatus(course, false).length > 0,
                );

                if (!hasLessons) return null;

                return (
                  <CategoryBlock
                    key={category.id}
                    category={category}
                    courses={categoryCourses}
                    isDraft={true}
                    openCategories={openCategories}
                    setOpenCategories={setOpenCategories}
                    openCourses={openCourses}
                    setOpenCourses={setOpenCourses}
                    selectedLesson={selectedLesson}
                    onSelect={(l) => {
                      setSelectedLesson(l);
                      setIsPlaying(false);
                    }}
                  />
                );
              })}
            </Section>

            {/* ===== PUBLISHED ===== */}
            <Section
              title="Veröffentlicht"
              open={openStatus.published}
              toggle={() =>
                setOpenStatus((s) => ({ ...s, published: !s.published }))
              }
            >
              {categories.map((category) => {
                const categoryCourses = coursesByCategory(category.id);
                const hasLessons = categoryCourses.some(
                  (course) => lessonsByStatus(course, true).length > 0,
                );

                if (!hasLessons) return null;

                return (
                  <CategoryBlock
                    key={category.id}
                    category={category}
                    courses={categoryCourses}
                    isDraft={false}
                    openCategories={openCategories}
                    setOpenCategories={setOpenCategories}
                    openCourses={openCourses}
                    setOpenCourses={setOpenCourses}
                    selectedLesson={selectedLesson}
                    onSelect={(l) => {
                      setSelectedLesson(l);
                      setIsPlaying(false);
                    }}
                  />
                );
              })}
            </Section>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN ===================== */}
      <section className="lg:col-span-8 space-y-6">
        {!selectedLesson ? (
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
        ) : (
          <>
            {/* ===== VIDEO CARD */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Show video ONLY if it exists */}
              {selectedLesson.videoLibraryId && selectedLesson.videoGuid && (
                <div className="relative bg-black aspect-video group">
                  {!isPlaying && (
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center text-white transition-transform hover:scale-110"
                    >
                      <div className="w-20 h-20 bg-lila-600 rounded-full flex items-center justify-center shadow-2xl">
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

                  {isPlaying && (
                    <iframe
                      src={`https://iframe.mediadelivery.net/embed/${selectedLesson.videoLibraryId}/${selectedLesson.videoGuid}?autoplay=true`}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  )}
                </div>
              )}

              {/* Video Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h1>

                    {selectedLesson.content && (
                      <div
                        className="mt-4 ck-content prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: selectedLesson.content,
                        }}
                      />
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedLesson.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedLesson.isPublished
                          ? "Veröffentlicht"
                          : "Entwurf"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {canEditLesson && (
                    <div className="flex gap-2">
                      {/* Delete Button - Now visible for BOTH Drafts and Published */}
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Löschen
                      </button>

                      {/* Publish Button - Only shows for Drafts */}
                      {!selectedLesson.isPublished && (
                        <button
                          onClick={handlePublish}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Veröffentlichen
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <DisplayFileDocuments
                  fileDocuments={fileDocuments}
                  onClickSelectedFileIdToDowndload={handleDownloadFileDocument}
                />
              </div>
            </div>

            {/* ===== COMMENTS ===== */}
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
                <span className="text-sm text-gray-500">
                  ({comments.length})
                </span>
              </div>

              {loadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lila-600" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Noch keine Kommentare vorhanden
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {comments.map((c) => {
                    const initial = (c.authorName?.[0] ?? "?").toUpperCase();
                    return (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lila-500 to-lila-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                          {initial}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-2xl px-4 py-3">
                            <p className="font-semibold text-sm text-gray-900">
                              {c.authorName}
                            </p>
                            <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                              {c.content}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1.5 ml-4">
                            {new Date(c.createdAt).toLocaleString("de-DE")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* NEW COMMENT */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lila-500 to-lila-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    {userInitial}
                  </div>

                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Schreiben Sie einen Kommentar..."
                    />

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={submitComment}
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
          </>
        )}
      </section>

      {/* ===================== DELETE MODAL ===================== */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Lektion löschen"
        message={`Sind Sie sicher, dass Sie die Lektion "${selectedLesson?.title}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmText="Löschen"
        cancelText="Abbrechen"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */

function Section({
  title,
  open,
  toggle,
  children,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={toggle}
        className="w-full px-6 py-4 font-bold text-left text-gray-800 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group"
      >
        <span className="text-base">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

type CategoryBlockProps = {
  category: Category;
  courses: CourseWithLessons[];
  isDraft: boolean;
  openCategories: Record<string, boolean>;
  setOpenCategories: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  openCourses: Record<string, boolean>;
  setOpenCourses: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedLesson: LessonInCourse | null;
  onSelect: (lesson: LessonInCourse) => void;
};

function CategoryBlock({
  category,
  courses,
  isDraft,
  openCategories,
  setOpenCategories,
  openCourses,
  setOpenCourses,
  selectedLesson,
  onSelect,
}: CategoryBlockProps) {
  const categoryKey = `${category.id}-${isDraft ? "draft" : "published"}`;
  const isCategoryOpen = !!openCategories[categoryKey];

  // Count total lessons in this category for this status
  const totalLessons = courses.reduce((sum, course) => {
    const lessons = course.lessons.filter((l) => l.isPublished === !isDraft);
    return sum + lessons.length;
  }, 0);

  if (totalLessons === 0) return null;

  return (
    <div className="px-3 mb-2">
      {/* Category Header */}
      <button
        onClick={() =>
          setOpenCategories((o) => ({ ...o, [categoryKey]: !o[categoryKey] }))
        }
        className="w-full flex items-center justify-between px-3 py-2.5 font-bold text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150 group"
      >
        <span className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              isCategoryOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          {category.name}
        </span>
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">
          {totalLessons}
        </span>
      </button>

      {/* Courses within Category */}
      {isCategoryOpen && (
        <div className="mt-1 ml-4 space-y-1">
          {courses.map((course) => {
            const lessons = course.lessons.filter(
              (l) => l.isPublished === !isDraft,
            );
            if (lessons.length === 0) return null;

            return (
              <CourseBlock
                key={course.id}
                course={course}
                lessons={lessons}
                openCourses={openCourses}
                setOpenCourses={setOpenCourses}
                selectedLesson={selectedLesson}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

type CourseBlockProps = {
  course: CourseWithLessons;
  lessons: LessonInCourse[];
  openCourses: Record<string, boolean>;
  setOpenCourses: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedLesson: LessonInCourse | null;
  onSelect: (lesson: LessonInCourse) => void;
};

function CourseBlock({
  course,
  lessons,
  openCourses,
  setOpenCourses,
  selectedLesson,
  onSelect,
}: CourseBlockProps) {
  const isOpen = !!openCourses[course.id];

  return (
    <div className="mb-1">
      <button
        onClick={() =>
          setOpenCourses((o) => ({ ...o, [course.id]: !o[course.id] }))
        }
        className="w-full flex items-center justify-between px-3 py-2.5 font-semibold text-sm text-gray-700 hover:bg-lila-50 rounded-lg transition-colors duration-150 group"
      >
        <span className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-lila-600 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {course.title}
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {lessons.length}
        </span>
      </button>

      {isOpen && (
        <div className="mt-1 ml-3 space-y-0.5">
          {lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => onSelect(l)}
              className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                selectedLesson?.id === l.id
                  ? "bg-lila-100 text-lila-900 font-medium border-l-3 border-lila-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedLesson?.id === l.id ? "bg-lila-600" : "bg-gray-300"
                  }`}
                />
                <span className="truncate">{l.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
