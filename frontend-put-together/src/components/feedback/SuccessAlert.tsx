type SuccessAlertProps = {
  message: string;
};

export default function SuccessAlert({ message }: SuccessAlertProps) {
  if (!message) return null;

  return (
    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
      <div className="flex items-center">
        <svg
          className="w-6 h-6 text-green-500 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-green-800 font-medium">{message}</p>
      </div>
    </div>
  );
}