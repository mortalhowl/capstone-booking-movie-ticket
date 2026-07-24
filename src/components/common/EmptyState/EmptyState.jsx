import { CircleAlert } from "lucide-react";
export default function EmptyState({
  message,
  icon,
  className,
  isLoading = false,
}) {
  return (
    <div
      className={`${className} ${isLoading ? "animate-pulse" : ""} flex flex-col items-center justify-center p-12 w-full bg-gray-50 rounded-lg border border-dashed border-gray-300`}
    >
      <div className="text-gray-400 mb-3">
        {icon || <CircleAlert size={88} strokeWidth={1.75} />}
      </div>
      <p className="text-gray-500 font-medium text-center">{message}</p>
    </div>
  );
}
