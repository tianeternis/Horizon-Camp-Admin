import "@/assets/css/dashboard.css";
import Overview from "@/components/dashboard/Overview";
import TimeFilter, {
  DEFAULT_DATES,
  DEFAULT_TIME_RANGE,
  DEFAULT_VIEW_TYPE,
} from "@/components/dashboard/TimeFilter";
import { useDynamicTitle } from "@/hooks";
import { useState } from "react";

const Dashboard = ({}) => {
  useDynamicTitle("Dashboard");

  const [filter, setFilter] = useState({
    timeRange: DEFAULT_TIME_RANGE,
    viewType: DEFAULT_VIEW_TYPE,
    dates: DEFAULT_DATES,
  });

  console.log(filter);

  return (
    <div className="dashboard space-y-6">
      <TimeFilter onSubmit={setFilter} />
      <Overview filter={filter} />
    </div>
  );
};

export default Dashboard;
