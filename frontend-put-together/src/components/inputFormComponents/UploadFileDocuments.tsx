import type { UploadFileProps } from "./typeUploadFile";

export const UploadFileDocuments = ({
  maxNumberOfFile,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onChange,
  loading,
  fileDocuments,
  onRemoveFileDocument,
}: UploadFileProps) => {
  const hasFiles = fileDocuments.length > 0;
  const reachedMax = fileDocuments.length >= maxNumberOfFile;

  return (
    <>
      {!reachedMax ? (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Datei hochladen *
          </label>

          <div
            className="relative border-2 border-dashed rounded-xl p-8 transition-all"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onChange}
              disabled={loading}
              id="file-upload"
              multiple
            />

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
                Datei hierher ziehen oder klicken
              </p>
              <p className="text-sm text-gray-500">Nur PDF Datei</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-lila-300 bg-lila-50 p-6 text-center">
          <p className="text-sm font-medium text-lila-700">
            Maximal {maxNumberOfFile} Dateien erlaubt.
          </p>
        </div>
      )}

      {hasFiles && (
        <ul className="space-y-3">
          {fileDocuments.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="
                  flex items-center justify-between
                  rounded-xl
                  border border-lila-200
                  bg-lila-50
                  px-5 py-4
                "
            >
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFileDocument(index);
                }}
                className="text-red-500 hover:text-red-700 p-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
