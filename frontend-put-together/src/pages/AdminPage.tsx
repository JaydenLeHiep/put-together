import { useState } from "react";
import { createLesson } from "../services/lessonService";
import { UploadFiles } from "../components/storageFiles/UploadFiles";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
      } else {
        alert("Bitte nur Videodateien hochladen");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  async function submitLesson() {
    if (!title.trim()) {
      alert("Bitte Titel eingeben");
      return;
    }
    if (!file) {
      alert("Bitte Video auswählen");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    form.append("file", file);

    setLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      await createLesson(form);
      setUploadProgress(100);
      setSuccessMessage("Lektion erfolgreich erstellt! 🎉");

      // Reset form after success
      setTimeout(() => {
        setTitle("");
        setContent("");
        setFile(null);
        setSuccessMessage("");
        setUploadProgress(0);
      }, 3000);
    } catch (err) {
      alert("Upload fehlgeschlagen");
      console.error(err);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-lila-700 mb-2">
          Neue Lektion erstellen
        </h1>
        <p className="text-gray-600">
          Laden Sie Videolektionen hoch und erstellen Sie begleitende Inhalte
          für Ihre Schüler
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titel der Lektion *
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
              placeholder="z.B. A2 – Perfekt mit sein"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beschreibung & Lernziele
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-4 h-40 focus:border-lila-500 focus:outline-none transition-colors resize-none text-gray-800 placeholder-gray-400"
              placeholder="Erklärung der Lektion, Beispiele, Hausaufgaben, wichtige Hinweise..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {content.length} Zeichen
            </p>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Video hochladen *
            </label>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                dragActive
                  ? "border-lila-500 bg-lila-50"
                  : file
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-lila-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={loading}
                id="file-upload"
              />

              {!file ? (
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-lila-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Video hierher ziehen oder klicken
                  </p>
                  <p className="text-sm text-gray-500">
                    MP4, MOV, AVI bis zu 2GB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-lila-100 rounded-lg p-3">
                      <svg
                        className="w-8 h-8 text-lila-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <UploadFiles />

          {/* Upload Progress */}
          {loading && (
            <div className="bg-lila-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-lila-700">
                  Video wird hochgeladen...
                </span>
                <span className="text-sm font-bold text-lila-700">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-lila-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-lila-500 to-lila-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-500">* Pflichtfelder</p>
            <button
              onClick={submitLesson}
              disabled={loading || !title.trim() || !file}
              className="bg-gradient-to-r from-lila-600 to-lila-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-lila-700 hover:to-lila-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Wird hochgeladen...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Lektion veröffentlichen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-lila-50 rounded-xl p-6">
        <h3 className="font-semibold text-lila-800 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Tipps für erfolgreiche Lektionen
        </h3>
        <ul className="space-y-2 text-sm text-lila-700">
          <li className="flex items-start">
            <span className="text-lila-500 mr-2">•</span>
            <span>
              Verwenden Sie aussagekräftige Titel mit Sprachniveau (A1, A2, B1,
              etc.)
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-lila-500 mr-2">•</span>
            <span>
              Fügen Sie klare Lernziele und Übungsaufgaben in der Beschreibung
              hinzu
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-lila-500 mr-2">•</span>
            <span>Videos sollten idealerweise 10-20 Minuten lang sein</span>
          </li>
          <li className="flex items-start">
            <span className="text-lila-500 mr-2">•</span>
            <span>
              Hochwertige Video- und Audioqualität verbessert das Lernerlebnis
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
