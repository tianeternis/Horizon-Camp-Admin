import noData from "@/assets/images/empty-data.png";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { getOrdersNumberByStatus } from "@/services/statisticService";
import StatusCodes from "@/utils/status/StatusCodes";
import { toast } from "react-toastify";
import { formatDateToDDMMYYYY } from "@/utils/format/date";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const OrderNumberChart = ({ filter }) => {
  const [data, setData] = useState([]);
  const [dates, setDates] = useState({ start: null, end: null });

  useEffect(() => {
    if (filter) {
      const fetchData = async () => {
        const res = await getOrdersNumberByStatus(filter);

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

  const newData = useMemo(
    () => ({
      data: {
        labels: data?.map((item) => item?.status),
        datasets: [
          {
            label: "Số đơn",
            data: data?.map((item) => item?.count),
            backgroundColor: [
              "#00deff",
              "#fffc00",
              "#c000ff",
              "#3cff00",
              "#ff0000",
            ],
            hoverOffset: 8,
          },
        ],
      },
      isInvalid: data?.every((item) => +item?.count === 0),
    }),
    [data],
  );

  return (
    <div className="h-full space-y-4 rounded-md bg-white p-4">
      <div className="space-y-1 text-sm font-medium">
        <div className="font-bold uppercase">Số đơn hàng theo trạng thái</div>
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
      <div className="py-8">
        {newData?.isInvalid ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20">
            <img src={noData} loading="lazy" alt="" className="w-24" />
            <div>Không có dữ liệu</div>
          </div>
        ) : (
          <Pie
            data={newData?.data}
            options={options}
            style={{ width: 300, height: 300 }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderNumberChart;
