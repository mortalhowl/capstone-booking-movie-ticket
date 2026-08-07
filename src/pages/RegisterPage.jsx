import { useEffect } from "react";
import { RegisterForm } from "@/features/auth";
import { scrollToTop } from "@/utils/scrollToTop";

export default function RegisterPage() {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <RegisterForm />
    </div>
  );
}
