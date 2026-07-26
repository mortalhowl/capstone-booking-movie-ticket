import useMovie from "@/features/movie/hooks/useMovie";
import MovieInfo from "@/features/movie/components/MovieInfo";

export default function TestMovieDetailPage() {
  const { data, loading, error } = useMovie();
  console.log(data);

  return (
    <div>
      <MovieInfo movie={data} loading={loading} error={error} />
    </div>
  );
}
