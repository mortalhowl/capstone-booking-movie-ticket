import Spinner from "@/components/common/Loading/Spinner";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import BannerItem from "./BannerItem";

export default function HeroBanner({ data, loading, error }) {
  if (loading)
    return <Spinner size="lg" className="h-[30vh] md:h-[50vh] lg:h-[70vh]" />;

  if (error) return <EmptyState message="Lỗi tải dữ liệu" />;

  const banners = Array.isArray(data) ? data : []; // check res data là mảng an toàn

  if (banners.length === 0) return <EmptyState message="Không có dữ liệu" />;

  return (
    <div className="relative w-full mt-4">
      <Swiper
        loop={true}
        autoplay={{
          delay: 3000,
        }}
        slidesPerView={"auto"}
        centeredSlides={true}
        spaceBetween={30}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper"
      >
        {banners?.map((banner, index) => {
          return (
            <SwiperSlide
              key={`Banner-${index}`}
              className="max-w-5xl aspect-2/1 overflow-hidden"
            >
              <BannerItem banner={banner} index={index} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="custom-prev absolute inset-y-0 my-auto left-0 z-10 w-7 h-14 flex justify-center items-center rounded-tr-full rounded-br-full bg-black/50 cursor-pointer">
        <ChevronLeft size={24} className="text-white" />
      </div>
      <div className="custom-next absolute inset-y-0 my-auto right-0 z-10 w-7 h-14 flex justify-center items-center rounded-tl-full rounded-bl-full bg-black/50 cursor-pointer">
        <ChevronRight size={24} className="text-white" />
      </div>
    </div>
  );
}
