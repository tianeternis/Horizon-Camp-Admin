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
import { RiTentFill } from "react-icons/ri";
import { PiListBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { ConfigProvider, Layout, Menu } from "antd";

const { Sider } = Layout;

const SITEMAP = [
  {
    key: "dashboard",
    label: <Link to="/">Dashboard</Link>,
    icon: <BiSolidDashboard />,
  },
  // {
  //   key: "statistical",
  //   label: <Link to="/statistical">Thống kê</Link>,
  //   icon: <BiSolidPieChartAlt2 />,
  // },
  {
    key: "user",
    label: <Link to="/manage-user">Quản lý người dùng</Link>,
    icon: <BiSolidUser />,
  },
  {
    key: "manage-category",
    label: <Link to="/manage-category">Quản lý danh mục</Link>,
    icon: <AiFillProduct />,
  },
  {
    key: "manage-brand",
    label: <Link to="/manage-brand">Quản lý thương hiệu</Link>,
    icon: <PiListBold />,
  },
  {
    key: "manage-product",
    label: <Link to="/manage-product">Quản lý sản phẩm</Link>,
    icon: <RiTentFill />,
  },
  {
    key: "order",
    label: <Link to="/order">Đơn hàng</Link>,
    icon: <BiSolidCartAlt />,
  },
  {
    key: "picnic-guide",
    label: <Link to="/picnic-guide">Cẩm nang dã ngoại</Link>,
    icon: <BiSolidBook />,
  },
  // {
  //   key: "coupon",
  //   label: <Link to="/coupon">Khuyến mãi</Link>,
  //   icon: <BiSolidCoupon />,
  // },
  // {
  //   key: "contact",
  //   label: <Link to="/contact">Liên hệ</Link>,
  //   icon: <BiSupport />,
  // },
  // {
  //   key: "review",
  //   label: <Link to="/review">Đánh giá</Link>,
  //   icon: <MdReviews />,
  // },
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
              itemSelectedColor: "var(--color-main)",
            },
          },
        }}
      >
        <Menu
          mode="inline"
          items={SITEMAP}
          defaultSelectedKeys={[SITEMAP[0].key]}
          style={{ border: "none", fontWeight: "600" }}
        />
      </ConfigProvider>
    </Sider>
  );
};

export default Sidebar;
