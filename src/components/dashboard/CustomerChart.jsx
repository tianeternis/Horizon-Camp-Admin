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
import {
  getCustomersByGender,
  getSoldAndOrdersNumber,
} from "@/services/statisticService";
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
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        autoSkip: true,
      },
    },
    y: {
      title: {
        display: true,
        text: "Số khách hàng (người)",
      },
      beginAtZero: true,
    },
  },
};

const CustomerChart = ({ filter }) => {
  const [data, setData] = useState([]);
  const [dates, setDates] = useState({ start: null, end: null });

  const [selectedChart, setSelectedChart] = useState(charts.line?.value);

  useEffect(() => {
    if (filter) {
      const fetchData = async () => {
        const res = await getCustomersByGender(filter);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setData(res.DT?.data);
          setDates({ start: res.DT?.startDate, end: res.DT?.endDate });
        }

        if (res && res.EC === StatusCodes.ERRROR) {
          toast.error(res.EM);
        }
      };

      fetchData();
    }
  }, [filter]);

  const newData = useMemo(() => {
    const adjustedMale = adjustData(
      data?.male || [],
      filter?.viewType,
      dates.start,
      dates.end,
    );

    const adjustedFemale = adjustData(
      data?.female || [],
      filter?.viewType,
      dates.start,
      dates.end,
    );

    const adjustedOther = adjustData(
      data?.other || [],
      filter?.viewType,
      dates.start,
      dates.end,
    );

    const adjustedDefault = adjustData(
      data?.default || [],
      filter?.viewType,
      dates.start,
      dates.end,
    );

    return {
      labels: adjustedMale?.map((item) => item?._id),
      datasets: [
        {
          label: "Nam",
          data: adjustedMale?.map((item) => item?.value),
          pointRadius: 4,
          ...(selectedChart === charts.bar.value
            ? { backgroundColor: "rgba(255, 230, 102, 1)" }
            : {
                backgroundColor: "rgba(255, 230, 102, 0.2)",
                borderColor: "rgba(255, 230, 102, 1)",
                borderWidth: 2,
              }),
        },
        {
          label: "Nữ",
          data: adjustedFemale?.map((item) => item?.value),
          pointRadius: 4,
          ...(selectedChart === charts.bar.value
            ? { backgroundColor: "rgba(209, 127, 255, 1)" }
            : {
                backgroundColor: "rgba(209, 127, 255, 0.2)",
                borderColor: "rgba(209, 127, 255, 1)",
                borderWidth: 2,
              }),
        },
        {
          label: "Khác",
          data: adjustedOther?.map((item) => item?.value),
          pointRadius: 4,
          ...(selectedChart === charts.bar.value
            ? { backgroundColor: "rgba(98, 96, 255, 1)" }
            : {
                backgroundColor: "rgba(98, 96, 255, 0.2)",
                borderColor: "rgba(98, 96, 255, 1)",
                borderWidth: 2,
              }),
        },
        {
          label: "Không xác định",
          data: adjustedDefault?.map((item) => item?.value),
          pointRadius: 4,
          ...(selectedChart === charts.bar.value
            ? { backgroundColor: "rgba(255, 151, 82, 1)" }
            : {
                backgroundColor: "rgba(255, 151, 82, 0.2)",
                borderColor: "rgba(255, 151, 82, 1)",
                borderWidth: 2,
              }),
        },
      ],
    };
  }, [data, selectedChart]);

  return (
    <div className="h-full space-y-4 rounded-md bg-white p-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="font-bold uppercase">Số khách hàng theo giới tính</div>
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

export default CustomerChart;
