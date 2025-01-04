import Sidebar from "@/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = ({}) => {
  return (
    <div className="font-main flex w-full">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
