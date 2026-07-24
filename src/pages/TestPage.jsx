import useBanner from "@/features/banner/hooks/useBanner";
import HeroBanner from "@/features/banner";

export default function TestPage() {
  const {
    data: banners,
    loading: loadingBanner,
    error: bannerError,
  } = useBanner();
  const bannerData =
    banners.length > 0 && banners.length < 6
      ? [...banners, ...banners, ...banners]
      : banners;

  return (
    <div>
      <HeroBanner
        data={bannerData}
        loading={loadingBanner}
        error={bannerError}
      />
    </div>
  );
}
