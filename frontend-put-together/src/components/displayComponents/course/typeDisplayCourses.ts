import type { StudentPaidCourse } from "../../../types/course";
import type { DisplayLessonType } from "../../../types/lesson";

export type DisplayCourseProps = {
  course: StudentPaidCourse;
  isOpen: boolean;
  onToggle: (id: string | null) => void;
  onSelectLesson: (lesson: DisplayLessonType) => void;
};