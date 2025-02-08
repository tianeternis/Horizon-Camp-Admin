import Topbar from "@/components/header/Topbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { ConfigProvider, Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const SIDEBAR_WIDTH = 240;
const COLLAPSE_WIDTH = 90;
const HEADER_HEIGHT = 96;

const MainLayout = ({}) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgLayout: "var(--color-main-bg)",
          fontFamily: "var(--font-main)",
        },
        components: {
          Layout: {
            bodyBg: "var(--color-main-bg)",
            headerBg: "var(--color-main-bg)",
            headerPadding: 0,
            headerHeight: "auto",
          },
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
          <Topbar collapsed={collapsed} handleCollapse={handleCollapse} />
          <Content>
            <div className="w-full px-6 pb-6">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
