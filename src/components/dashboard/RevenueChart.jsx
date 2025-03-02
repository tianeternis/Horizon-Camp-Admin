import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { getRevenue } from "@/services/statisticService";
import StatusCodes from "@/utils/status/StatusCodes";
import { toast } from "react-toastify";
import { formatDateToDDMMYYYY } from "@/utils/format/date";
import { adjustData } from "./help/adjustFullData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const charts = {
  line: {
    label: "Biểu đồ đường",
    value: "line",
    getComponent: (options, data) => <Line options={options} data={data} />,
  },
  bar: {
    label: "Biểu đồ cột",
    value: "bar",
    getComponent: (options, data) => <Bar options={options} data={data} />,
  },
};

// Cấu hình biểu đồ
const options = {
  plugins: {
    legend: {
      position: "top",
    },
  },
  maintainAspectRatio: false, // Cho phép chỉnh chiều cao
  scales: {
    x: {
      ticks: {
        autoSkip: true,
      },
    },
    y: {
      title: { display: true, text: "Doanh thu (VNĐ)" },
      beginAtZero: true,
    },
  },
};

const RevenueChart = ({ filter }) => {
  const [data, setData] = useState([]);
  const [dates, setDates] = useState({ start: null, end: null });

  const [selectedChart, setSelectedChart] = useState(charts.line?.value);

  useEffect(() => {
    if (filter) {
      const fetchRevenue = async () => {
        const res = await getRevenue(filter);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setData(res.DT?.data);
          setDates({ start: res.DT?.startDate, end: res.DT?.endDate });
        }

        if (res && res.EC === StatusCodes.ERRROR) {
          toast.error(res.EM);
        }
      };

      fetchRevenue();
    }
  }, [filter]);

  const newData = useMemo(() => {
    const adjustedData = adjustData(
      data,
      filter?.viewType,
      dates.start,
      dates.end,
    );

    return {
      labels: adjustedData?.map((item) => item?._id),
      datasets: [
        {
          label: "Doanh thu",
          data: adjustedData?.map((item) => item?.value),
          pointRadius: 4,
          fill: true,
          ...(selectedChart === charts.bar.value
            ? { backgroundColor: "rgba(131, 255, 166, 1)" }
            : {
                backgroundColor: "rgba(131, 255, 166, 0.2)",
                borderColor: "rgba(131, 255, 166, 1)",
                borderWidth: 2,
              }),
        },
      ],
    };
  }, [data, selectedChart]);

  return (
    <div className="h-full space-y-4 rounded-md bg-white p-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="font-bold uppercase">Doanh thu</div>
        <div className="text-13px text-gray-500">
          {(() => {
            if (dates.start && dates.end) {
              const start = formatDateToDDMMYYYY(dates.start);
              const end = formatDateToDDMMYYYY(dates.end);

              return `${start}${start !== end ? ` - ${end}` : ""}`;
            } else return null;
          })()}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {Object.values(charts)?.map((chart, i) => (
          <div
            key={`chart-option-${i}-${chart?.value}`}
            className={`cursor-pointer rounded-full border border-solid border-gray-200 px-4 py-1.5 text-13px hover:border-main hover:text-main ${selectedChart === chart?.value ? "border-main bg-main text-white hover:text-white" : ""}`}
            onClick={() => setSelectedChart(chart?.value)}
          >
            {chart?.label}
          </div>
        ))}
      </div>
      <div style={{ height: 360 }}>
        {charts?.[selectedChart]?.getComponent(options, newData)}
      </div>
    </div>
  );
};

export default RevenueChart;
