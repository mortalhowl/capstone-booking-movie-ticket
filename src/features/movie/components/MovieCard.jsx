import { Link } from "react-router-dom";
import { Star, Image } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import VideoModal from "@/components/common/Modal/VideoModal";

export default function MovieCard({ movie }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow border border-gray-100 hover:shadow-xl transition-shadow group">
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
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
          <Link
            to={`/movie/${movie.maPhim}`}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Đặt vé ngay
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
          >
            Xem trailer
          </button>
        </div>
        {movie.hot && (
          <div className="absolute top-2 left-2 bg-red-500 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 text-white text-sm font-semibold">
            HOT
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 text-white text-sm font-semibold">
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
          {movie.danhGia}
        </div>
      </div>
      <div className="p-3 grow">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
          {movie.tenPhim}
        </h3>
      </div>

      <VideoModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        videoUrl={movie.trailer}
      />
    </div>
  );
}
