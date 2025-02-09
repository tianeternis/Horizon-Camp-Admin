export const formatDateToHHMMDDMMYYYY = (date) => {
  if (!date) return "";

  const formatter = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return formatter.format(new Date(date));
};

export const formatDateToDDMMYYYY = (date) => {
  if (!date) return "";

  const formatter = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formatter.format(new Date(date));
};
