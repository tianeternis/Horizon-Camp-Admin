import { ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";

const COLOR_MAIN = "#ff8c16";

const AppLayout = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "var(--font-main)",
          colorPrimary: COLOR_MAIN,
        },
        components: {
          Input: {
            activeBorderColor: COLOR_MAIN,
            activeShadow: "0 0 0 2px rgba(255,134,0,0.1)",
            hoverBorderColor: COLOR_MAIN,
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
