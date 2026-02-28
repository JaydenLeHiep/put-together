import type { ErrorMessageProps } from "./typeErrorMessage";

export default function ErrorMessage({
  message,
  title,
  onClose,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {/* Check Icon */}
          <svg
            className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
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

          <div>
            {title && <p className="text-red-900 font-semibold">{title}</p>}
            <p className="red-green-800 font-medium">{message}</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 red-green-700 hover:text-red-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
