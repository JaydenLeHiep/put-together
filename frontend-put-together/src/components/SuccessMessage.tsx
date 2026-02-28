import type { SuccessMessageProps } from "./typeSuccessMesssage";

export default function SuccessMessage({
  message,
  title,
  onClose,
  className = "",
}: SuccessMessageProps) {
  return (
    <div
      className={`mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {/* Check Icon */}
          <svg
            className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
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
            {title && <p className="text-green-900 font-semibold">{title}</p>}
            <p className="text-green-800 font-medium">{message}</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-green-700 hover:text-green-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
