import { ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "var(--font-main)",
        },
        components: {
          Input: {
            activeBorderColor: "var(--color-main)",
            activeShadow: "0 0 0 2px rgba(255,134,0,0.1)",
            hoverBorderColor: "var(--color-main)",
            inputFontSize: "14px",
          },
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
};

export default AppLayout;
