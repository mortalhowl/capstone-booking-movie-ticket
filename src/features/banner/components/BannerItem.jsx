import { useState } from "react";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Image } from "lucide-react";

export default function BannerItem({ banner, index }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {!isLoaded && (
        <EmptyState
          icon={<Image size={88} strokeWidth={1.75} />}
          className="aspect-2/1"
          isLoading={true}
        />
      )}
      <img
        src={banner.hinhAnh}
        alt={`Banner-${index + 1}`}
        onLoad={() => setIsLoaded(true)}
        className={`h-full w-full object-fill transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
      />
    </div>
  );
}
