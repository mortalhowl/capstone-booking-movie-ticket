import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Film, ChevronDown, Ticket } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { useAuth } from "@/features/auth";

export default function Header() {
  const { isAuthenticated, handleLogout, data } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Lịch chiếu", path: "/show-time" },
    { name: "Cụm rạp", path: "/cinema" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Film className="w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight text-blue-700">
            CyberMovie
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-md"
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {data?.hoTen.charAt(0)}
                </div>
                <span className="font-medium">Chào, {data?.hoTen}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <Link
                    to="/user-info"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" /> Thông tin cá nhân
                  </Link>
                  <Link
                    to="/booking-history"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Ticket className="w-4 h-4" /> Lịch sử đặt vé
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="outline" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="primary" size="sm">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-gray-600 hover:text-blue-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 animate-in slide-in-from-top-2">
          <nav className="flex flex-col px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2 pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {data?.hoTen.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {data?.hoTen}
                      </p>
                      <Link
                        to="/user-info"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Quản lý tài khoản
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-3 text-red-600 font-medium hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="w-5 h-5" /> Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-3">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" className="w-full">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
