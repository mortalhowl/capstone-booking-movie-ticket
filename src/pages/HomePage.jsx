import useBanner from "@/features/banner/hooks/useBanner";
import useMovies from "@/features/movie/hooks/useMovies";
import HeroBanner from "@/features/banner";
import MovieList from "@/features/movie/components/MovieList";
import { useMemo, useState } from "react";

export default function HomePage() {
  const {
    data: banners,
    loading: loadingBanner,
    error: bannerError,
  } = useBanner();

  const bannerData = useMemo(() => {
    if (banners.length > 0 && banners.length < 6) {
      return [...banners, ...banners, ...banners];
    }
    return banners;
  }, [banners]);

  const {
    upcomingMovies,
    nowPlaying,
    loading: loadingMovie,
    error: errorMovie,
  } = useMovies();

  const [activeMovieTab, setActiveMovieTab] = useState("nowPlaying");
  const [viewMore, setViewMore] = useState(false);

  const filteredMovies =
    activeMovieTab === "nowPlaying"
      ? viewMore
        ? nowPlaying
        : nowPlaying.slice(0, 10)
      : viewMore
        ? upcomingMovies
        : upcomingMovies.slice(0, 10);

  return (
    <div>
      <HeroBanner
        data={bannerData}
        loading={loadingBanner}
        error={bannerError}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveMovieTab("nowPlaying")}
            className={`pb-3 px-2 text-xl font-bold transition-colors border-b-4 ${activeMovieTab === "nowPlaying" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-800"}`}
          >
            Đang Chiếu
          </button>
          <button
            onClick={() => setActiveMovieTab("upcomingMovies")}
            className={`pb-3 px-2 text-xl font-bold transition-colors border-b-4 ${activeMovieTab === "upcomingMovies" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-800"}`}
          >
            Sắp Chiếu
          </button>
        </div>
        <MovieList
          data={filteredMovies}
          loading={loadingMovie}
          error={errorMovie}
        />
        {!viewMore && (
          <div className="mt-5 flex flex-col justify-center items-center">
            <button
              onClick={() => setViewMore(true)}
              className="px-3 py-2 text-blue-500 bg-white border border-blue-500 rounded-lg cursor-pointer"
            >
              Xem thêm
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
