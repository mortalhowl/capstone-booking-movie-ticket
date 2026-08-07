import { Link } from "react-router-dom";
import Button from "@/components/common/Button/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Trang không tồn tại
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui
        lòng kiểm tra lại đường dẫn.
      </p>
      <Link to="/">
        <Button size="lg" className="shadow-lg hover:shadow-xl">
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
}
