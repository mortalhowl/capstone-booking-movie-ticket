export default function VideoModal({ isOpen, onClose, videoUrl }) {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)?([a-zA-Z0-9_-]{11})/;

  const getYoutubeIframe = (videoUrl) => {
    const match = videoUrl.match(youtubeRegex);
    if (match && match[1]) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return null;
  };

  let url = "";
  if (videoUrl) {
    url = getYoutubeIframe(videoUrl);
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
        {videoUrl ? (
          <iframe
            className="w-full h-full"
            src={url}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            Video không khả dụng
          </div>
        )}
      </div>
    </div>
  );
}
