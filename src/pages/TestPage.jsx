import useBanner from "@/features/banner/hooks/useBanner";
import useMovies from "@/features/movie/hooks/useMovies";
import HeroBanner from "@/features/banner";
import { useMemo, useState } from "react";

export default function TestPage() {
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

  const { upcomingMovies, nowPlaying, loading, error, fetchMovies } =
    useMovies();
  console.log(upcomingMovies, nowPlaying);

  const [search, setSearch] = useState({
    tenPhim: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    // console.log(value);
    setSearch({
      tenPhim: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };
  return (
    <div>
      <HeroBanner
        data={bannerData}
        loading={loadingBanner}
        error={bannerError}
      />

      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          className="border border-gray-500"
        />
        <button type="submit">search</button>
      </form>
    </div>
  );
}
