import type { DisplayCourse } from "../../../types/Course";
import type { DisplayLessonType } from "../../../types/Lesson";

export type DisplayCourseProps = {
    course: DisplayCourse;
    isOpen: boolean;
    onToggle: (id: string | null) => void;
    selectedLesson: DisplayLessonType | null;
    onSelectLesson: (lesson: DisplayLessonType) => void;
};
