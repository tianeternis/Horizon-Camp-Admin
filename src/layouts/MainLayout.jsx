import Sidebar from "@/components/sidebar/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = ({}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex w-full">
      <Sidebar expand={collapsed} />
      <div className="grow overflow-x-hidden">
        <header>
          <button
            className="bg-red-400 p-4"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            Collapse
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
