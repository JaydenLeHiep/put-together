type UploadProgressBarProps = {
  loading: boolean;
  progress: number;
};

export default function UploadProgressBar({ loading, progress }: UploadProgressBarProps) {
  if (!loading) return null;

  return (
    <div className="bg-lila-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-lila-700">Video wird hochgeladen...</span>
        <span className="text-sm font-bold text-lila-700">{progress}%</span>
      </div>

      <div className="w-full bg-lila-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-lila-500 to-lila-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}