import { useEffect, useState } from "react";
import { createLesson } from "../../../services/lessonService";
import { getAllCourses } from "../../../services/courseService";
import CkEditorField from "../../../components/editor/CkEditorField";
import type { Course } from "../../../types/course";
import "../../../styles/editor.css";

import { UploadFileDocuments } from "../../../components/inputFormComponents/UploadFileDocuments";
import SuccessAlert from "../../../components/feedback/SuccessAlert";
import PostLessonHeader from "./PostLessonHeader";
import VideoDropzone from "./VideoDropzone";
import UploadProgressBar from "./UploadProgressBar";
import PostLessonTips from "./PostLessonTips";
import { InputText } from "../../../components/inputFormComponents/InputText";

export default function AdminPage() {
  const MAX_NUMBER_FILE_DOCUMENT_TO_UPLOAD = 10;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const [fileDocuments, setFileDocuments] = useState<File[]>([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    }
    loadCourses();
  }, []);

  // -----------------------
  // VIDEO drag/drop handlers
  // -----------------------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (droppedFile.type.startsWith("video/")) setFile(droppedFile);
    else alert("Bitte nur Videodateien hochladen");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);

    e.target.value = "";
  };

  // -----------------------
  // PDF helpers
  // -----------------------
  const handleRemoveFile = (index: number) => {
    setFileDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  function addPdfFiles(files: File[]) {
    const pdfs = files.filter(
      (f) =>
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );

    if (pdfs.length === 0) {
      alert("Bitte nur PDF-Dateien hochladen");
      return;
    }

    setFileDocuments((prev) => {
      const existing = new Set(
        prev.map((f) => `${f.name}_${f.size}_${f.lastModified}`),
      );
      const deduped = pdfs.filter(
        (f) => !existing.has(`${f.name}_${f.size}_${f.lastModified}`),
      );

      const remaining = MAX_NUMBER_FILE_DOCUMENT_TO_UPLOAD - prev.length;
      if (remaining <= 0) {
        alert(`Maximal ${MAX_NUMBER_FILE_DOCUMENT_TO_UPLOAD} Dateien erlaubt.`);
        return prev;
      }

      const next = [...prev, ...deduped.slice(0, remaining)];
      if (deduped.length > remaining) {
        alert(
          `Nur ${remaining} weitere PDF-Datei(en) konnten hinzugefügt werden (Limit erreicht).`,
        );
      }
      return next;
    });
  }

  const handleDocsDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDocsDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = Array.from(e.dataTransfer.files ?? []);
    if (dropped.length === 0) return;
    addPdfFiles(dropped);
  };

  const handleFileDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addPdfFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  // -----------------------
  // Submit
  // -----------------------
  async function submitLesson() {
    if (!courseId) return alert("Bitte Kurs auswählen");
    if (!title.trim()) return alert("Bitte Titel eingeben");

    const form = new FormData();
    form.append("courseId", courseId);
    form.append("title", title.trim());
    form.append("content", content ?? "");

    if (file) form.append("VideoFile", file);
    fileDocuments.forEach((doc) => form.append("Documents", doc));

    setLoading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 300);

    try {
      await createLesson(form);
      setUploadProgress(100);
      setSuccessMessage("Lektion erfolgreich erstellt!");

      setTimeout(() => {
        setTitle("");
        setContent("");
        setCourseId("");
        setFile(null);
        setSuccessMessage("");
        setFileDocuments([]);
        setUploadProgress(0);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Upload fehlgeschlagen");
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PostLessonHeader />

      <SuccessAlert message={successMessage} />

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Course Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kurs auswählen *
            </label>
            <select
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={loading}
            >
              <option value="">Bitte Kurs auswählen</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.level} – {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titel der Lektion *
            </label>
            <InputText
              value={title}
              onSetInput={setTitle}
              disabled={loading}
            ></InputText>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beschreibung & Lernziele
            </label>
            <CkEditorField
              value={content}
              onChange={setContent}
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {content.length} Zeichen
            </p>
          </div>

          {/* Video Upload */}
          <VideoDropzone
            file={file}
            dragActive={dragActive}
            loading={loading}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            onRemove={() => setFile(null)}
          />

          {/* PDF Upload */}
          <UploadFileDocuments
            maxNumberOfFile={MAX_NUMBER_FILE_DOCUMENT_TO_UPLOAD}
            onDragEnter={handleDocsDrag}
            onDragLeave={handleDocsDrag}
            onDragOver={handleDocsDrag}
            onDrop={handleDocsDrop}
            onChange={handleFileDocumentChange}
            loading={loading}
            fileDocuments={fileDocuments}
            onRemoveFileDocument={handleRemoveFile}
          />

          {/* Upload Progress */}
          <UploadProgressBar loading={loading} progress={uploadProgress} />

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-500">* Pflichtfelder</p>

            <button
              onClick={submitLesson}
              disabled={loading || !title.trim()}
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
                  <span>Lektion erstellen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <PostLessonTips />
    </div>
  );
}
