import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date, formatType = "date") => {
  if (!date || !dayjs(date).isValid()) return "";

  const d = dayjs(date);

  const formats = {
    date: "DD/MM/YYYY",
    datetime: "DD/MM/YYYY HH:mm:ss",
    datetimeShort: "DD/MM/YYYY HH:mm",
    time: "HH:mm:ss",
    timeShort: "HH:mm",

    iso: "YYYY-MM-DD",
    isoDateTime: "YYYY-MM-DD HH:mm:ss",
    us: "MM/DD/YYYY",

    full: "dddd, D MMMM YYYY",
    monthYear: "MM/YYYY",
    yearOnly: "YYYY",
  };

  const formatString = formats[formatType] || formatType;

  return d.format(formatString);
};

export const now = dayjs().tz("Asia/Ho_Chi_Minh");
