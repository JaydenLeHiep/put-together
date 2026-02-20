import React from "react";
import { useState } from "react";
import type { CategoryWithCourses } from "../../components/displayComponents/typeDisplayCategoryCourse";
import { DisplayCategory } from "../../components/displayComponents/DisplayCategory";

export const StudentDashboard = () => {
  const FAKE_DATA: CategoryWithCourses[] = [
    {
      categoryId: "1",
      categoryName: "A1 Beginner",
      courses: [
        {
          courseId: "101",
          title: "A1 Grammar",
          expiresAtUtc: "2026-03-19T15:16:09Z",
        },
        {
          courseId: "102",
          title: "A1 Vocabulary",
          expiresAtUtc: "2026-04-10T10:00:00Z",
        },
      ],
    },
    {
      categoryId: "2",
      categoryName: "B1 Intermediate",
      courses: [
        {
          courseId: "201",
          title: "B1 Speaking",
          expiresAtUtc: "2026-05-01T12:00:00Z",
        },
      ],
    },
  ];

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openCourseId, setOpenCourseId] = useState<string | null>(null);

  return (
    <>
      <h1>Deine Kurse</h1>
      <DisplayCategory
        categories={FAKE_DATA}
        openCategoryId={openCategoryId}
        onToggleCategory={setOpenCategoryId}
        openCourseId={openCourseId}
        onToggleCourse={setOpenCourseId}
      ></DisplayCategory>
    </>
  );
};
