import type { DisplayLessonContentProps } from "./typeDisplayLessonVideo";

export const DisplayLessonContent = ({
  title,
  content,
}: DisplayLessonContentProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>

      {content && (
        <div
          className="mt-4 ck-content prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </>
  );
};
