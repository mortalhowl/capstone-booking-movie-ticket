import { Film, MapPin, Phone, Mail, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <Film className="w-8 h-8 text-blue-500" />
              <span className="font-extrabold text-blue-500 text-2xl tracking-tight">
                CyberMovie
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hệ thống đặt vé xem phim trực tuyến hàng đầu, mang đến cho bạn
              trải nghiệm điện ảnh tuyệt vời nhất với mạng lưới rạp phủ sóng
              toàn quốc.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">
              Đối tác
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* TODO: LẤY LOGO RẠP, BỔ SUNG API SAU */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Ticket className="w-6 h-6 text-gray-500" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">
              Chính sách
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Chính sách thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">
              Liên hệ
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                <span>112 Cao Thắng, Phường 4, Quận 3, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                <span>support@cybermovie.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CyberMovie.</p>
        </div>
      </div>
    </footer>
  );
}
