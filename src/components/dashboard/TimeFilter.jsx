import { useState } from "react";
import { Select, DatePicker, Button } from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;

const timeRanges = [
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày vừa qua", value: "last7days" },
  { label: "30 ngày vừa qua", value: "last30days" },
];

const viewTypes = [
  { label: "Hàng ngày", value: "daily" },
  { label: "Hàng tháng", value: "monthy" },
  { label: "Hàng năm", value: "yearly" },
];

export const DEFAULT_TIME_RANGE = timeRanges[0]?.value;
export const DEFAULT_VIEW_TYPE = viewTypes[0]?.value;
export const DEFAULT_DATES = [null, null];

const TimeFilter = ({ onSubmit = (value) => {} }) => {
  const [timeRange, setTimeRange] = useState(DEFAULT_TIME_RANGE);
  const [viewType, setViewType] = useState(DEFAULT_VIEW_TYPE);
  const [dates, setDates] = useState(DEFAULT_DATES);

  const handleTimeChange = (value) => {
    setTimeRange(value);
    setDates(DEFAULT_DATES);
    onSubmit({
      timeRange: value,
      viewType,
      DEFAULT_DATES,
    });
  };

  const handleViewChange = (value) => {
    setViewType(value);
  };

  const handleDateChange = (dates) => {
    setDates(dates);
    setTimeRange(null);
  };

  const handleSubmit = () => {
    onSubmit({
      timeRange,
      viewType,
      dates,
    });
  };

  return (
    <div className="time-filter flex items-center gap-4">
      <div className="flex w-1/2 shrink-0 rounded-md border border-solid border-gray-100 bg-white">
        {timeRanges.map((time, i) => (
          <div
            key={`time-range-${i}-${time?.value}`}
            className={`default-height flex-1 cursor-pointer px-4 py-2 text-center text-sm font-medium hover:text-main ${i == 0 ? "rounded-s-md" : ""} ${i === timeRanges.length - 1 ? "rounded-e-md" : ""} ${timeRange === time?.value ? "bg-main text-white hover:text-white" : ""}`}
            onClick={() => handleTimeChange(time.value)}
          >
            {time?.label}
          </div>
        ))}
      </div>
      <Select
        value={viewType}
        onChange={handleViewChange}
        className="default-height w-48 shrink-0"
      >
        {viewTypes.map((type, i) => (
          <Option key={`view-type-${i}-${type.value}`} value={type.value}>
            {type.label}
          </Option>
        ))}
      </Select>
      <RangePicker
        format={"DD/MM/YYYY"}
        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
        className="default-height w-full"
        value={dates}
        onChange={handleDateChange}
      />
      <Button
        type="primary"
        className="default-height w-28 shrink-0"
        onClick={handleSubmit}
      >
        Thống kê
      </Button>
    </div>
  );
};

export default TimeFilter;
