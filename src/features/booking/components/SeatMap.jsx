import { Monitor, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import SeatLegend from "./SeatLegend";
import Seat from "./Seat";

export default function SeatMap({ danhSachGhe, onToggleSeat, selectedSeats }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const ITEMS_PER_ROW = 16;

  return (
    <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="relative w-full max-w-full overflow-hidden bg-gray-50/50 rounded-lg border border-gray-100">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={3}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute top-3 right-3 z-10 flex gap-1 bg-white/90 backdrop-blur border border-gray-200 p-1 rounded-lg shadow-sm">
                <button
                  onClick={() => zoomIn()}
                  type="button"
                  className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  type="button"
                  className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  type="button"
                  className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
                  title="Đặt lại"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{ width: "100%", minHeight: "400px" }}
                contentStyle={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-col items-center py-6 px-4">
                  <div className="mb-12 flex flex-col items-center w-full">
                    <div className="w-3/4 max-w-md h-2 bg-gray-300 rounded-full shadow-[0_15px_30px_-10px_rgba(59,130,246,0.5)] mb-4" />
                    <span className="text-gray-400 font-bold tracking-widest text-sm flex items-center gap-2">
                      <Monitor className="w-4 h-4" /> MÀN HÌNH
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 select-none">
                    {rows.map((rowLabel, rowIndex) => {
                      const startIndex = rowIndex * ITEMS_PER_ROW;
                      const rowSeats = danhSachGhe.slice(
                        startIndex,
                        startIndex + ITEMS_PER_ROW,
                      );

                      return (
                        <div
                          key={rowLabel}
                          className="flex items-center gap-2 sm:gap-3"
                        >
                          <div className="w-6 font-bold text-gray-400 text-center select-none">
                            {rowLabel}
                          </div>

                          <div className="flex gap-2 sm:gap-3">
                            {rowSeats.map((ghe, idx) => (
                              <Seat
                                key={ghe.maGhe}
                                selectedSeats={selectedSeats}
                                ghe={ghe}
                                idx={idx}
                                onToggleSeat={onToggleSeat}
                              />
                            ))}
                          </div>

                          <div className="w-6 font-bold text-gray-400 text-center select-none">
                            {rowLabel}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <div className="mt-6">
        <SeatLegend />
      </div>
    </div>
  );
}
