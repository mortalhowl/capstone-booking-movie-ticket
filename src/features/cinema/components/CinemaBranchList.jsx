import ShowtimesList from "./ShowtimesList";

export default function CinemaBranchList({
  filteredCumRap,
  currentSystemData,
}) {
  return (
    <>
      {filteredCumRap.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          Hiện tại hệ thống rạp này không có suất chiếu trong ngày này.
        </div>
      ) : (
        filteredCumRap.map((cumRap) => (
          <div
            key={cumRap.maCumRap}
            className="mb-6 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0"
          >
            <div className="flex gap-4 items-start mb-4">
              <img
                src={currentSystemData?.logo}
                alt="Logo"
                className="w-12 h-12 rounded mt-1 object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {cumRap.tenCumRap}
                </h3>
                <p className="text-gray-500 text-sm">{cumRap.diaChi}</p>
              </div>
            </div>

            <div className="space-y-4 pl-0 md:pl-16">
              {cumRap.danhSachPhim?.map((phim) => (
                <div key={phim.maPhim} className="bg-gray-50/50 p-3 rounded-md">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">•</span> {phim.tenPhim}
                  </h4>

                  <ShowtimesList phim={phim} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
