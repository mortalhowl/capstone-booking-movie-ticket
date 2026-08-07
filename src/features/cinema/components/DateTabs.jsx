export default function DateTabs({ dateTabs, selectedDate, onSelectDate }) {
  const activeDate = selectedDate || dateTabs[0].id;

  return (
    <div className=" border-x border-t border-gray-200 rounded-t-lg shadow-md">
      <div className="flex overflow-x-auto no-scrollbar p-2 gap-2">
        {dateTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectDate(tab.id)}
            className={`flex flex-col items-center justify-center min-w-20 p-3 rounded-lg transition-all ${
              activeDate === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span
              className={`text-xs font-medium mb-1 ${activeDate === tab.id ? "text-blue-100" : "text-gray-500"}`}
            >
              {tab.dayName}
            </span>
            <span className="text-lg font-bold">{tab.dateStr}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
