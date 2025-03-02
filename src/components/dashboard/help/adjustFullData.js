import dayjs from "dayjs";

const generateFullDateArray = (startDate, endDate, viewType) => {
  let unit;
  if (viewType === "daily") {
    unit = "day";
  } else if (viewType === "monthly") {
    unit = "month";
  } else if (viewType === "yearly") {
    unit = "year";
  } else {
    return [];
  }

  let fullDateList = [];
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end, unit)) {
    fullDateList.push(
      current.format(
        unit === "day" ? "DD/MM/YYYY" : unit === "month" ? "MM/YYYY" : "YYYY",
      ),
    );
    current = current.add(1, unit);
  }

  return fullDateList;
};

export const adjustData = (data, viewType, start, end) => {
  if (!data || !viewType || !start || !end) return [];

  const fullDate = generateFullDateArray(start, end, viewType);

  const dataMap = new Map(data?.map((item) => [item?._id, item?.value]));

  return fullDate?.map((date) => ({
    _id: date,
    value: dataMap.get(date) || 0,
  }));
};
