export default function InputField({
  label,
  type = "text",
  error,
  register,
  className = "",
  ...rest
}) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        {...register}
        {...rest}
        className={`w-full border rounded-md px-3 py-2 outline-none transition-shadow focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
        }`}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
