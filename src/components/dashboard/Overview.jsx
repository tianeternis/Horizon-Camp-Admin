import { getOverview } from "@/services/statisticService";
import { formatCurrency } from "@/utils/format/currency";
import StatusCodes from "@/utils/status/StatusCodes";
import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaUserAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { PiTentFill } from "react-icons/pi";

const Overview = ({ filter }) => {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchOverview = async () => {
      const res = await getOverview(filter);

      if (res && res.EC === StatusCodes.SUCCESS) {
        setData(res.DT);
      }
    };

    fetchOverview();
  }, [filter]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 items-center gap-4 rounded-md bg-white p-4">
        <div className="rounded-full border border-solid border-yellow-100 bg-yellow-50 p-4 text-xl text-yellow-600">
          <FaMoneyBillWave />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase text-gray-500">
            Tổng doanh thu
          </div>
          <div className="text-lg font-semibold">
            {formatCurrency(data?.totalRevenue)}
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-4 rounded-md bg-white p-4">
        <div className="rounded-full border border-solid border-green-100 bg-green-50 p-4 text-xl text-green-600">
          <FaCartShopping />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase text-gray-500">
            Tổng số đơn hàng
          </div>
          <div className="text-lg font-semibold">{data?.totalOrders}</div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-4 rounded-md bg-white p-4">
        <div className="rounded-full border border-solid border-blue-100 bg-blue-50 p-4 text-xl text-blue-600">
          <PiTentFill />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase text-gray-500">
            Tổng số sản phẩm đã bán
          </div>
          <div className="text-lg font-semibold">{data?.totalProducts}</div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-4 rounded-md bg-white p-4">
        <div className="rounded-full border border-solid border-rose-100 bg-rose-50 p-4 text-xl text-rose-600">
          <FaUserAlt />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase text-gray-500">
            Tổng số khách hàng
          </div>
          <div className="text-lg font-semibold">{data?.totalCustomers}</div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
