import { useEffect, useState } from "react";
import { getAllUsers } from "../../../services/userService";
import {
  getAllCourses,
  getCourseWithLessons,
} from "../../../services/courseService";

type CourseIdLike = { id?: string };
type CourseWithLessonsLike = { lessons?: unknown[] };

type AdminDashboardStats = {
  statsLoading: boolean;
  statsError: string | null;
  totalCourses: number;
  totalLessons: number;
  totalUsers: number;
};

export function useAdminDashboardStats(): AdminDashboardStats {
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [totalCourses, setTotalCourses] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setStatsLoading(true);
      setStatsError(null);

      try {
        const [users, courses] = await Promise.all([
          getAllUsers(),
          getAllCourses(),
        ]);

        if (cancelled) return;

        setTotalUsers(Array.isArray(users) ? users.length : 0);
        setTotalCourses(Array.isArray(courses) ? courses.length : 0);

        const courseIds = (Array.isArray(courses) ? courses : [])
          .map((c: CourseIdLike) => c.id)
          .filter((id): id is string => Boolean(id));

        const results = await Promise.allSettled(
          courseIds.map((id) => getCourseWithLessons(id))
        );

        if (cancelled) return;

        const lessonsCount = results.reduce((sum, result) => {
          if (result.status === "fulfilled") {
            const value = result.value as CourseWithLessonsLike;
            return sum + (Array.isArray(value.lessons) ? value.lessons.length : 0);
          }
          return sum;
        }, 0);

        setTotalLessons(lessonsCount);
      } catch (error) {
        if (cancelled) return;
        setStatsError(
          error instanceof Error
            ? error.message
            : "Statistiken konnten nicht geladen werden."
        );
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    statsLoading,
    statsError,
    totalCourses,
    totalLessons,
    totalUsers,
  };
}