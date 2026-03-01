import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import type { LessonComment } from "../../../types/lessonComment";
import type { CourseWithLessons, LessonInCourse } from "../../../types/course";
import type { Category } from "../../../types/category";
import {
  getLessonComments,
  addLessonComment,
  publishLesson,
  deleteLesson,
} from "../../../services/lessonService";
import {
  getAllCourses,
  getCourseWithLessons,
} from "../../../services/courseService";
import { getAllCategories } from "../../../services/categoryService";
import {
  getFileDocumentsByLessonId,
  downloadFileDocumentsByFileIdAndLessonId,
} from "../../../services/fileDocumentService";
import type { FileDocument } from "../../../components/displayComponents/lessonFileDocuments/typeDisplayFileDocuments";

export function useAdminCoursesPage() {
  const { user } = useAuth();

  const [fileDocuments, setFileDocuments] = useState<FileDocument[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLesson, setSelectedLesson] = useState<LessonInCourse | null>(null);

  const [comments, setComments] = useState<LessonComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const [openStatus, setOpenStatus] = useState({
    draft: true,
    published: true,
  });
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openCourses, setOpenCourses] = useState<Record<string, boolean>>({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userInitial = useMemo(
    () => (user?.userName?.[0] ?? "?").toUpperCase(),
    [user?.userName],
  );

  const canEditLesson = useMemo(() => {
  if (!selectedLesson) return false;
  if (!user?.id) return false;
  return user.id === selectedLesson.userId;
}, [selectedLesson, user?.id]);

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

  useEffect(() => {
    const lessonId = selectedLesson?.id;

    if (!lessonId) {
      setComments([]);
      setLoadingComments(false);
      setFileDocuments([]);
      return;
    }

    let cancelled = false;

    async function loadComments(id: string) {
      setLoadingComments(true);
      try {
        const data = await getLessonComments(id);
        if (!cancelled) setComments(data);
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    }

    async function loadFiles(id: string) {
      const data = await getFileDocumentsByLessonId(id);
      if (!cancelled) setFileDocuments(data);
    }

    loadComments(lessonId);
    loadFiles(lessonId);

    return () => {
      cancelled = true;
    };
  }, [selectedLesson?.id]);

  async function refreshCourses() {
    const allCourses = await getAllCourses();
    const withLessons = await Promise.all(
      allCourses.map((c) => getCourseWithLessons(c.id)),
    );
    setCourses(withLessons);
  }

  function handleSelectLesson(lesson: LessonInCourse) {
    setSelectedLesson(lesson);
  }

  async function handleDownloadFileDocument(fileId: string) {
    if (!selectedLesson?.id) return;

    const data = await downloadFileDocumentsByFileIdAndLessonId(
      fileId,
      selectedLesson.id,
    );

    window.open(data.url, "_blank");
  }

  async function submitComment() {
    const lessonId = selectedLesson?.id;
    if (!lessonId) return;

    const content = newComment.trim();
    if (!content) return;

    await addLessonComment(lessonId, { content });
    setNewComment("");

    const updated = await getLessonComments(lessonId);
    setComments(updated);
  }

  async function handlePublish() {
    const lessonId = selectedLesson?.id;
    if (!lessonId) return;

    try {
      await publishLesson(lessonId);
      await refreshCourses();

      setSelectedLesson((prev) =>
        prev ? { ...prev, isPublished: true } : prev,
      );
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
      await refreshCourses();
      setSelectedLesson(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    loading,
    categories,
    courses,
    selectedLesson,
    comments,
    newComment,
    loadingComments,
    fileDocuments,
    openStatus,
    openCategories,
    openCourses,
    showDeleteModal,
    isDeleting,
    userInitial,
    canEditLesson,

    setNewComment,
    setOpenStatus,
    setOpenCategories,
    setOpenCourses,
    setShowDeleteModal,
    handleSelectLesson,
    handleDownloadFileDocument,
    submitComment,
    handlePublish,
    handleDeleteConfirm,
  };
}