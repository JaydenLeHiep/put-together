import type { DisplayCourse } from "../../../types/course";
import type { DisplayLessonType } from "../../../types/lesson";

export type DisplayCourseProps = {
    course: DisplayCourse;
    isOpen: boolean;
    onToggle: (id: string | null) => void;
    onSelectLesson: (lesson: DisplayLessonType) => void;
};
