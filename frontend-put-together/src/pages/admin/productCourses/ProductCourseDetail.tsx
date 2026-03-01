import { DisplayLessonVideo } from "../../../components/displayComponents/lesson/DisplayLessonVideo";
import { DisplayLessonContent } from "../../../components/displayComponents/lesson/DisplayLessonContent";
import type { LessonInCourse } from "../../../types/course";

type ProductCourseDetailProps = {
  selectedLesson: LessonInCourse;
};

export default function ProductCourseDetail({
  selectedLesson,
}: ProductCourseDetailProps) {
  return (
    <section className="lg:col-span-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
        <span className="absolute top-4 right-4 z-10 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
          Veröffentlicht
        </span>

        <DisplayLessonVideo
          videoLibraryId={selectedLesson.videoLibraryId}
          videoGuid={selectedLesson.videoGuid}
        />

        <div className="p-6">
          <DisplayLessonContent
            title={selectedLesson.title}
            content={selectedLesson.content}
          />
        </div>
      </div>
    </section>
  );
}