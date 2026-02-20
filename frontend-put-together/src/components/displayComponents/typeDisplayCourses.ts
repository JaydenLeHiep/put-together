export type Course = {
    courseId: string,
    title: string,
    expiresAtUtc: string
}

export type DisplayCourseProps = {
    course: Course;
    isOpen: boolean;
    onToggle: (id: string | null) => void;
};
