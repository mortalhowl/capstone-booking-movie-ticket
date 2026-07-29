export default function Spinner({ size = "md", label = "", className = "" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`flex flex-col justify-center items-center py-20 ${className}`}
    >
      <div
        className={`${sizes[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
      ></div>
      {label && <span className="mt-3 text-gray-500 font-medium">{label}</span>}
    </div>
  );
}
