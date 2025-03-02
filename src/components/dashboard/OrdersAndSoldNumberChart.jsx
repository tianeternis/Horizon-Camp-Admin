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
import { getSoldAndOrdersNumber } from "@/services/statisticService";
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
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
      },
    },
    yOrders: {
      position: "left",
      title: {
        display: true,
        text: "Số đơn hàng hoàn thành (đơn)",
      },
      beginAtZero: true,
    },
    yQuantity: {
      position: "right",
      title: {
        display: true,
        text: "Số sản phẩm bán ra (sản phẩm)",
      },
      grid: {
        drawOnChartArea: false,
      },
      beginAtZero: true,
    },
  },
};

const OrdersAndSoldNumberChart = ({ filter }) => {
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState([]);
  const [dates, setDates] = useState({ start: null, end: null });

  const [selectedChart, setSelectedChart] = useState(charts.line?.value);

  useEffect(() => {
    if (filter) {
      const fetchData = async () => {
        const res = await getSoldAndOrdersNumber(filter);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setOrders(res.DT?.data?.orders);
          setProduct(res.DT?.data?.product);
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
    const adjustedOrders = adjustData(
      orders,
      filter?.viewType,
      dates.start,
      dates.end,
    );

    const adjustedProduct = adjustData(
      product,
      filter?.viewType,
      dates.start,
      dates.end,
    );

    return {
      labels: adjustedOrders?.map((item) => item?._id),
      datasets: [
        {
          label: "Số đơn hàng hoàn thành",
          data: adjustedOrders?.map((item) => item?.value),
          yAxisID: "yOrders",
          pointRadius: 4,
          ...(selectedChart === charts.bar.value
            ? { backgroundColor: "rgba(255, 138, 184, 1)" }
            : {
                backgroundColor: "rgba(255, 138, 184, 0.2)",
                borderColor: "rgba(255, 138, 184, 1)",
                borderWidth: 2,
              }),
        },
        {
          label: "Số sản phẩm bán ra",
          data: adjustedProduct?.map((item) => item?.value),
          yAxisID: "yQuantity",
          pointRadius: 4,
          ...(selectedChart === charts.bar.value
            ? { backgroundColor: "rgba(107, 192, 255, 1)" }
            : {
                backgroundColor: "rgba(107, 192, 255, 0.2)",
                borderColor: "rgba(107, 192, 255, 1)",
                borderWidth: 2,
              }),
        },
      ],
    };
  }, [orders, product, selectedChart]);

  return (
    <div className="h-full space-y-4 rounded-md bg-white p-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="font-bold uppercase">
          Số đơn hàng hoàn thành và số sản phẩm bán ra
        </div>
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

export default OrdersAndSoldNumberChart;
