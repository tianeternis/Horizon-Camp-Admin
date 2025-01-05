import Sidebar from "@/components/sidebar/Sidebar";
import { ConfigProvider, Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const SIDEBAR_WIDTH = 240;
const COLLAPSE_WIDTH = 90;

const MainLayout = ({}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgLayout: "var(--color-main-bg)",
          fontFamily: "var(--font-main)",
        },
      }}
    >
      <Layout hasSider>
        <Sidebar
          collapsed={collapsed}
          width={SIDEBAR_WIDTH}
          collapsedWidth={COLLAPSE_WIDTH}
        />
        <Layout
          style={{
            marginInlineStart: !collapsed ? SIDEBAR_WIDTH : COLLAPSE_WIDTH,
          }}
        >
          <Content>
            <button
              className="bg-red-400 p-4"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              Collapse
            </button>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
