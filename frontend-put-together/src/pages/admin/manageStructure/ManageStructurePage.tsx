import { useManageStructurePage } from "./useManageStructurePage";
import CategoryCreateForm from "./CategoryCreateForm";
import CategoryList from "./CategoryList";
import EmptyCategoriesState from "./EmptyCategoriesState";

export default function ManageStructurePage() {
  const {
    categories,
    courses,
    expandedCategories,
    expandedCourses,
    showCategoryForm,
    showCourseForm,
    editingCategory,
    editingCourse,
    newCategory,
    newCourse,

    setShowCategoryForm,
    setShowCourseForm,
    setEditingCategory,
    setEditingCourse,
    setNewCategory,
    setNewCourse,

    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    toggleCategory,
    toggleCourse,
    getCategoryTitle,
    resetCategoryForm,
    resetCourseForm,
  } = useManageStructurePage();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-lila-700">
          Kategorien & Kurse verwalten
        </h1>

        <button
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="bg-lila-600 text-white px-6 py-2 rounded-lg hover:bg-lila-700 transition"
        >
          + Neue Kategorie
        </button>
      </div>

      {showCategoryForm && (
        <CategoryCreateForm
          newCategory={newCategory}
          onChange={setNewCategory}
          onSave={handleCreateCategory}
          onCancel={resetCategoryForm}
        />
      )}

      {categories.length === 0 ? (
        <EmptyCategoriesState />
      ) : (
        <CategoryList
          categories={categories}
          courses={courses}
          expandedCategories={expandedCategories}
          expandedCourses={expandedCourses}
          showCourseForm={showCourseForm}
          editingCategory={editingCategory}
          editingCourse={editingCourse}
          newCourse={newCourse}
          onSetShowCourseForm={setShowCourseForm}
          onSetEditingCategory={setEditingCategory}
          onSetEditingCourse={setEditingCourse}
          onSetNewCourse={setNewCourse}
          onToggleCategory={toggleCategory}
          onToggleCourse={toggleCourse}
          onGetCategoryTitle={getCategoryTitle}
          onCreateCourse={handleCreateCourse}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={handleDeleteCourse}
          onResetCourseForm={resetCourseForm}
        />
      )}
    </div>
  );
}