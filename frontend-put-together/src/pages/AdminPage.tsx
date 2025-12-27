import { useState } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitLesson() {
    if (!file) return alert("Bitte Video auswählen");

    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    form.append("file", file);

    setLoading(true);

    const res = await fetch("http://localhost:8080/api/lessons", {
      method: "POST",
      body: form,
    });

    setLoading(false);

    if (!res.ok) {
      alert("Upload fehlgeschlagen");
      return;
    }

    alert("Lektion erfolgreich erstellt 🎉");
    setTitle("");
    setContent("");
    setFile(null);
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-8">
      <h1 className="text-3xl font-bold text-lila-700 mb-6">
        Neue Lektion erstellen
      </h1>

      <label className="block mb-2 font-medium">Titel</label>
      <input
        className="w-full border rounded p-3 mb-4"
        placeholder="z.B. A2 – Perfekt mit sein"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block mb-2 font-medium">Inhalt</label>
      <textarea
        className="w-full border rounded p-3 h-40 mb-4"
        placeholder="Erklärung, Beispiele, Hausaufgaben…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label className="block mb-2 font-medium">Video</label>
      <input
        type="file"
        accept="video/*"
        className="mb-6"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={submitLesson}
        disabled={loading}
        className="bg-lila-600 text-white px-6 py-3 rounded hover:bg-lila-700"
      >
        {loading ? "Hochladen…" : "Lektion veröffentlichen"}
      </button>
    </div>
  );
}