import { Layout } from "antd";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaHome, FaUser } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { Dropdown } from "antd";
import Avatar from "@/components/avatar/Avatar";
import { Link } from "react-router-dom";

const { Header } = Layout;

const items = [
  {
    label: (
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Avatar
            src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-44.jpg"
            size={40}
          />
        </div>
        <div className="space-y-0.5">
          <div className="text-15px font-bold text-black">Quản trị viên</div>
          <div className="text-13px text-gray-500">Quản trị viên</div>
        </div>
      </div>
    ),
    key: "user-information",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    label: (
      <Link to="/" className="text-15px block py-0.5">
        Trang chủ
      </Link>
    ),
    icon: <FaHome />,
    key: "home",
  },
  {
    label: (
      <Link to="/profile" className="text-15px block py-0.5">
        Trang cá nhân
      </Link>
    ),
    icon: <FaUser />,
    key: "user-account",
  },
  {
    type: "divider",
  },
  {
    label: (
      <button className="text-15px block py-0.5 text-red-500">Đăng xuất</button>
    ),
    icon: <BiLogOutCircle className="h-4 w-4 text-red-500" />,
    key: "signout",
  },
];

const Topbar = ({ collapsed = false, handleCollapse = () => {} }) => {
  return (
    <Header
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "var(--color-main-bg)",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      <div className="flex w-full items-center justify-between p-6">
        <div className="flex items-center justify-center">
          <button
            className="flex items-center justify-center"
            onClick={() => handleCollapse()}
          >
            <RiMenuUnfoldLine
              className={`h-7 w-7 duration-100 ${collapsed ? "" : "-scale-x-100"}`}
            />
          </button>
        </div>
        <div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <div className="group flex cursor-pointer items-center gap-2">
              <Avatar
                src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-44.jpg"
                size={42}
              />
              <span className="text-15px font-medium text-black group-hover:text-main">
                Quản trị viên
              </span>
              <TiArrowSortedDown className="h-6 w-6 group-hover:text-main" />
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default Topbar;
