import useSearchMovies from "@/features/movie/hooks/useSearchMovies";

export default function TestSearchPage() {
  const { keyword, searchError, searchLoading, searchResults } =
    useSearchMovies();
  return <div>TestSearchPage</div>;
}
