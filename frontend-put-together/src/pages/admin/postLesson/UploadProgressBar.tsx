type UploadProgressBarProps = {
  loading: boolean;
  progress: number;
  successMessage?: string;
};

export default function UploadProgressBar({
  loading,
  progress,
  successMessage,
}: UploadProgressBarProps) {
  if (!loading && !successMessage) return null;

  const isSuccess = !!successMessage;

  return (
    <div
      className={`rounded-xl p-6 ${
        isSuccess
          ? "bg-green-50/60 border border-green-200"
          : "bg-lila-50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        {!isSuccess ? (
          <>
            <span className="text-sm font-medium text-lila-700">
              Video wird hochgeladen...
            </span>
            <span className="text-sm font-bold text-lila-700">{progress}%</span>
          </>
        ) : (
          <div className="w-full flex items-center gap-3">
            <div className="h-10 w-1.5 rounded-full bg-green-500" />
            <div className="flex-1">
              <p className="text-base font-bold text-green-900">
                {successMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {!isSuccess && (
        <div className="w-full bg-lila-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-lila-500 to-lila-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}