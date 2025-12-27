import { useEffect, useState } from "react";

type Lesson = {
  id: string;
  title: string;
  content: string;
  videoGuid: string;
};

export default function CoursePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/lessons")
      .then((r) => r.json())
      .then(setLessons);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Sidebar */}
      <aside className="col-span-4 bg-white rounded-xl shadow p-4">
        <h2 className="font-bold mb-4 text-lila-700">Lektionen</h2>

        {lessons.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(l)}
            className="block w-full text-left p-2 rounded hover:bg-lila-100"
          >
            {l.title}
          </button>
        ))}
      </aside>

      {/* Content */}
      <section className="col-span-8 bg-white rounded-xl shadow p-6">
        {!selected && (
          <p className="text-gray-500">Bitte Lektion auswählen</p>
        )}

        {selected && (
          <>
            <h1 className="text-2xl font-bold text-lila-700 mb-4">
              {selected.title}
            </h1>

            <video
              controls
              className="w-full rounded mb-4"
              src={`https://video.bunnycdn.com/play/${selected.videoGuid}`}
            />

            <div className="prose max-w-none">
              {selected.content}
            </div>
          </>
        )}
      </section>
    </div>
  );
}