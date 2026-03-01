import "../../../styles/editor.css";
import Modal from "../../../layout/Modal";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAdminCoursesPage } from "./useAdminCoursesPage";
import AdminCoursesSidebar from "./AdminCoursesSidebar";
import AdminCoursesLessonDetail from "./AdminCoursesLessonDetail";
import AdminCoursesComments from "./AdminCoursesComments";

export default function AdminCoursesPage() {
  const {
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
  } = useAdminCoursesPage();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <AdminCoursesSidebar
        categories={categories}
        courses={courses}
        openStatus={openStatus}
        setOpenStatus={setOpenStatus}
        openCategories={openCategories}
        setOpenCategories={setOpenCategories}
        openCourses={openCourses}
        setOpenCourses={setOpenCourses}
        selectedLesson={selectedLesson}
        onSelectLesson={handleSelectLesson}
      />

      <div className="lg:col-span-8 space-y-6">
        <AdminCoursesLessonDetail
          selectedLesson={selectedLesson}
          canEditLesson={canEditLesson}
          fileDocuments={fileDocuments}
          onDownloadFile={handleDownloadFileDocument}
          onPublish={handlePublish}
          onDelete={() => setShowDeleteModal(true)}
        />

        <AdminCoursesComments
          selectedLessonId={selectedLesson?.id ?? null}
          comments={comments}
          loadingComments={loadingComments}
          newComment={newComment}
          userInitial={userInitial}
          onNewCommentChange={setNewComment}
          onSubmitComment={submitComment}
        />
      </div>

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