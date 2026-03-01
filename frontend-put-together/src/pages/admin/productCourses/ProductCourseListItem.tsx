import type { Lesson } from "../../../types/lesson";

type ProductCourseListItemProps = {
  lesson: Lesson;
  index: number;
  isSelected: boolean;
  onClick: () => void;
};

function getLessonNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default function ProductCourseListItem({
  lesson,
  index,
  isSelected,
  onClick,
}: ProductCourseListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b transition-all hover:bg-lila-50 ${
        isSelected
          ? "bg-lila-100 border-l-4 border-lila-600"
          : "border-l-4 border-transparent"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
            isSelected
              ? "bg-lila-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {getLessonNumber(index)}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold line-clamp-2">{lesson.title}</h3>

          <span className="inline-block mt-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
            Veröffentlicht
          </span>
        </div>
      </div>
    </button>
  );
}