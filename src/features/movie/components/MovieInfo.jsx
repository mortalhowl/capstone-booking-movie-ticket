import { useState } from "react";
import { Play, Calendar, Clock, Film, Star, Image } from "lucide-react";
import VideoModal from "@/components/common/Modal/VideoModal";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Spinner from "@/components/common/Loading/Spinner";
import { formatDate } from "@/utils/formatDate";

export default function MovieInfo({ movie, loading, error }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  const handleCloseModal = () => {
    setIsVideoOpen(false);
  };

  if (loading)
    return <Spinner size="lg" className="h-[30vh] md:h-[50vh] lg:h-[70vh]" />;

  if (error) return <EmptyState message="Lỗi tải dữ liệu" />;

  if (movie.length === 0) return <EmptyState message="Không có dữ liệu" />;

  return (
    <div className="relative bg-[#0a0f1c] text-white py-12 lg:py-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center blur-2xl"
        style={{ backgroundImage: `url(${movie.hinhAnh})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
          <div className="w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 relative group rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="relative w-full aspect-2/3 overflow-hidden">
              {!isLoaded && (
                <EmptyState
                  icon={<Image size={88} strokeWidth={1.75} />}
                  className="aspect-2/3"
                  isLoading={true}
                />
              )}
              <img
                src={movie.hinhAnh}
                alt={movie.tenPhim}
                onLoad={handleImageLoad}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
              <button
                onClick={() => setIsVideoOpen(true)}
                className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-colors"
              >
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left w-full">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 justify-center md:justify-start w-full">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  C18
                </span>
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  2D/3D
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {movie.tenPhim}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />{" "}
                {formatDate(movie.ngayKhoiChieu)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" /> 166 Phút
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" /> Hành Động, Viễn
                Tưởng
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 w-fit mx-auto md:mx-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-yellow-400 text-lg font-bold text-yellow-400 bg-yellow-400/10">
                {movie.danhGia}
              </div>
              <div className="flex flex-col text-sm text-gray-400 text-left">
                <div className="flex text-yellow-400 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(movie.danhGia / 2) ? "fill-current" : "opacity-30"}`}
                    />
                  ))}
                </div>
                <span>Đánh giá từ người dùng</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-semibold text-white/90">
                Nội dung phim
              </h3>
              <p className="text-gray-300 leading-relaxed text-justify md:text-left text-sm md:text-base opacity-80">
                {movie.moTa}
              </p>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={handleCloseModal}
        videoUrl={movie.trailer}
      />
    </div>
  );
}
