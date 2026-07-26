import dayjs from "dayjs";

export const formatDate = (date, withTime = false) => {
  if (!date || !dayjs(date).isValid()) return "";

  const formatString = withTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY";

  return dayjs(date).format(formatString);
};
