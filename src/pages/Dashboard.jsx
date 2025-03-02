import "@/assets/css/dashboard.css";
import OrderNumberChart from "@/components/dashboard/OrderNumberChart";
import Overview from "@/components/dashboard/Overview";
import OrdersAndSoldNumberChart from "@/components/dashboard/OrdersAndSoldNumberChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TimeFilter, {
  DEFAULT_DATES,
  DEFAULT_TIME_RANGE,
  DEFAULT_VIEW_TYPE,
} from "@/components/dashboard/TimeFilter";
import { useDynamicTitle } from "@/hooks";
import { useState } from "react";
import CustomerChart from "@/components/dashboard/CustomerChart";

const Dashboard = ({}) => {
  useDynamicTitle("Dashboard");

  const [filter, setFilter] = useState({
    timeRange: DEFAULT_TIME_RANGE,
    viewType: DEFAULT_VIEW_TYPE,
    dates: DEFAULT_DATES,
  });

  return (
    <div className="dashboard space-y-6">
      <TimeFilter onSubmit={setFilter} />
      <Overview filter={filter} />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <RevenueChart filter={filter} />
        </div>
        <div className="col-span-1">
          <OrderNumberChart filter={filter} />
        </div>
      </div>
      <OrdersAndSoldNumberChart filter={filter} />
      <CustomerChart filter={filter} />
    </div>
  );
};

export default Dashboard;
