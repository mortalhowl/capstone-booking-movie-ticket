import useSearchMovies from "@/features/movie/hooks/useSearchMovies";
import MovieList from "@/features/movie/components/MovieList";
export default function TestSearchPage() {
  const { keyword, movies, searchLoading, searchError } = useSearchMovies();

  return (
    <div>
      <MovieList data={movies} loading={searchLoading} error={searchError} />
    </div>
  );
}
