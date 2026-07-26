import MovieCard from "./MovieCard";
import Spinner from "@/components/common/Loading/Spinner";
import EmptyState from "@/components/common/EmptyState/EmptyState";

export default function MovieList({ data, loading, error }) {
  if (loading)
    return <Spinner size="lg" className="h-[30vh] md:h-[50vh] lg:h-[70vh]" />;

  if (error) return <EmptyState message="Lỗi tải dữ liệu" />;

  return (
    <>
      {!data || data.length === 0 ? (
        <EmptyState message="Không có dữ liệu" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {data.map((movie) => (
            <MovieCard key={movie.maPhim} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
