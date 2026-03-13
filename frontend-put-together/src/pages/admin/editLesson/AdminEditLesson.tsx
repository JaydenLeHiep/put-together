import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getLessonById, updateLesson } from "../../../services/lessonService";
import { getFileDocumentsByLessonId } from "../../../services/fileDocumentService";

import type { Lesson } from "../../../types/lesson";
import type { FileDocument } from "../../../components/displayComponents/lessonFileDocuments/typeDisplayFileDocuments";
import { DisplayFileDocuments } from "../../../components/displayComponents/lessonFileDocuments/DisplayFileDocuments";
import { InputText } from "../../../components/inputFormComponents/InputText";
import CkEditorField from "../../../components/editor/CkEditorField";
import { UploadFileDocuments } from "../../../components/inputFormComponents/UploadFileDocuments";
import { downloadFileDocumentsByFileIdAndLessonId } from "../../../services/fileDocumentService";
import SuccessMessage from "../../../components/SuccessMessage";
import ErrorMessage from "../../../components/ErrorMessage";
export const AdminEditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const MAX_NUMBER_FILE_DOCUMENT_TO_UPLOAD = 10;

  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [existingFiles, setExistingFiles] = useState<FileDocument[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deleteFileIds, setDeleteFileIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    let cancelled = false;

    async function loadLesson(id: string) {
      setLoading(true);

      try {
        const lessonData = await getLessonById(id);
        const files = await getFileDocumentsByLessonId(id);

        if (!cancelled) {
          setLesson(lessonData);
          setExistingFiles(files);
        }
      } catch {
        setErrorMessage("Fehler beim Laden der Lektion");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLesson(lessonId);

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  useEffect(() => {
    if (!lesson) return;

    setTitle(lesson.title ?? "");
    setContent(lesson.content ?? "");
  }, [lesson]);

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  function removeExistingFile(fileId: string) {
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
    setDeleteFileIds((prev) => [...prev, fileId]);
  }

  function addFiles(files: File[]) {
    const pdfs = files.filter(
      (f) =>
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );

    if (pdfs.length === 0) {
      alert("Bitte nur PDF-Dateien hochladen");
      return;
    }

    setNewFiles((prev) => {
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
        alert(`Nur ${remaining} weitere Dateien konnten hinzugefügt werden.`);
      }

      return next;
    });
  }

  const handleFileDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    addFiles(Array.from(e.target.files));

    e.target.value = "";
  };

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpdateLesson() {
    if (!lessonId) return;

    if (!title.trim()) {
      alert("Bitte Titel eingeben");
      return;
    }

    const form = new FormData();

    form.append("title", title);
    form.append("content", content);

    deleteFileIds.forEach((id) => form.append("deleteFileIds", id));

    newFiles.forEach((file) => form.append("Documents", file));

    setLoading(true);

    try {
      await updateLesson(lessonId, form);

      setSuccessMessage("Lektion erfolgreich aktualisiert");

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch {
      setErrorMessage("Update fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  if (loading && !lesson) {
    return <p>Loading lesson...</p>;
  }

  if (!lesson) {
    return <p>Lesson not found</p>;
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

    addFiles(dropped);
  };

  async function handleDownloadFileDocument(fileId: string) {
    if (!lesson?.id) return;

    const data = await downloadFileDocumentsByFileIdAndLessonId(
      fileId,
      lesson.id,
    );

    window.open(data.url, "_blank");
  }

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold">Lektion bearbeiten</h1>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Titel der Lektion *
          </label>

          <InputText value={title} onSetInput={setTitle} disabled={loading} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Beschreibung
          </label>

          <CkEditorField
            value={content}
            onChange={setContent}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Aktuelle Dokumente
          </label>

          {existingFiles.length === 0 && (
            <p className="text-gray-500 text-sm">Keine Dokumente vorhanden</p>
          )}

          <div className="space-y-3">
            <DisplayFileDocuments
              fileDocuments={existingFiles}
              onClickSelectedFileIdToDowndload={handleDownloadFileDocument}
              onDeleteFile={removeExistingFile}
            />
          </div>
        </div>

        <UploadFileDocuments
          maxNumberOfFile={MAX_NUMBER_FILE_DOCUMENT_TO_UPLOAD}
          loading={loading}
          fileDocuments={newFiles}
          onRemoveFileDocument={removeNewFile}
          onChange={handleFileDocumentChange}
          onDragEnter={handleDocsDrag}
          onDragLeave={handleDocsDrag}
          onDragOver={handleDocsDrag}
          onDrop={handleDocsDrop}
        />

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border rounded-lg"
          >
            Abbrechen
          </button>

          <button
            onClick={handleUpdateLesson}
            disabled={loading}
            className="bg-lila-600 text-white px-6 py-3 rounded-lg hover:bg-lila-700"
          >
            Speichern
          </button>
        </div>
        {successMessage && (
          <SuccessMessage
            title="Success!"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {errorMessage && (
          <ErrorMessage
            title="Error!"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}
      </div>
    </>
  );
};
