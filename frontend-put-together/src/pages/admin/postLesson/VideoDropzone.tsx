import { useMemo } from "react";

type VideoDropzoneProps = {
  file: File | null;
  dragActive: boolean;
  loading: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export default function VideoDropzone({
  file,
  dragActive,
  loading,
  onDrag,
  onDrop,
  onFileChange,
  onRemove,
}: VideoDropzoneProps) {
  const containerClass = useMemo(() => {
    if (dragActive) return "border-lila-500 bg-lila-50";
    if (file) return "border-green-400 bg-green-50";
    return "border-gray-300 hover:border-lila-400";
  }, [dragActive, file]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Video hochladen (optional)
      </label>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${containerClass}`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="video/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileChange}
          disabled={loading}
          id="video-upload"
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
            <p className="text-sm text-gray-500">MP4, MOV, AVI bis zu 2GB</p>
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
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              disabled={loading}
              className="text-red-500 hover:text-red-700 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}