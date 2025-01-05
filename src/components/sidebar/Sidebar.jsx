import "@/assets/css/sidebar.css";
import logo from "@/assets/images/logo.webp";
import {
  BiSolidBook,
  BiSolidCartAlt,
  BiSolidCoupon,
  BiSolidDashboard,
  BiSolidPieChartAlt2,
  BiSolidUser,
  BiSupport,
} from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import { MdReviews } from "react-icons/md";
import { Link } from "react-router-dom";
import { ConfigProvider, Flex, Layout, Menu } from "antd";

const { Sider } = Layout;

const SITEMAP = [
  {
    key: "dashboard",
    path: "/",
    label: "Dashboard",
    icon: <BiSolidDashboard />,
  },
  {
    key: "statistical",
    path: "/statistical",
    label: "Thống kê",
    icon: <BiSolidPieChartAlt2 />,
  },
  {
    key: "user",
    path: "/user",
    label: "Người dùng",
    icon: <BiSolidUser />,
  },
  {
    label: "Sản phẩm",
    icon: <AiFillProduct />,
    children: [
      {
        key: "manage-category",
        path: "/manage-category",
        label: "Quản lý danh mục",
      },
      {
        key: "manage-brand",
        path: "/manage-brand",
        label: "Quản lý thương hiệu",
      },
      {
        key: "manage-product",
        path: "/manage-product",
        label: "Quản lý món ăn",
      },
    ],
  },
  {
    key: "order",
    path: "/order",
    label: "Đơn hàng",
    icon: <BiSolidCartAlt />,
  },
  {
    key: "blog",
    path: "/blog",
    label: "Cẩm nang dã ngoại",
    icon: <BiSolidBook />,
  },
  {
    key: "coupon",
    path: "/coupon",
    label: "Khuyến mãi",
    icon: <BiSolidCoupon />,
  },
  {
    key: "contact",
    path: "/contact",
    label: "Liên hệ",
    icon: <BiSupport />,
  },
  {
    key: "review",
    path: "/review",
    label: "Đánh giá",
    icon: <MdReviews />,
  },
];

const Sidebar = ({ collapsed = false, width = 240, collapsedWidth = 90 }) => {
  const siderStyle = {
    backgroundColor: "#fff",
    overflow: "auto",
    height: "100vh",
    position: "fixed",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={siderStyle}
      theme="light"
      width={width}
      collapsedWidth={collapsedWidth}
      className="sidebar"
    >
      <div className="sticky top-0 z-50 flex items-center justify-center bg-white py-6">
        <Link
          to="/"
          className="relative m-0 box-border inline-flex cursor-pointer select-none appearance-none items-center justify-center rounded-none border-0 bg-transparent p-0 align-middle outline-0"
        >
          <div className="flex items-center justify-center gap-3.5">
            <img
              src={logo}
              alt=""
              loading="lazy"
              className={`h-auto ${!collapsed ? "w-20" : "w-12"}`}
            />
          </div>
        </Link>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              iconSize: 18,
              collapsedIconSize: 22,
              fontSize: 15,
              itemHeight: 45,
              subMenuItemBg: "#fff",
              itemActiveBg: "#fff5e6",
              itemSelectedBg: "#fff5e6",
              itemSelectedColor: "#ff8c16",
            },
          },
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[SITEMAP[0].key]}
          style={{ border: "none", fontWeight: "600" }}
        >
          {SITEMAP.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>
                    <Link to={child.path}>{child.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ),
          )}
        </Menu>
      </ConfigProvider>
    </Sider>
  );
};

export default Sidebar;
