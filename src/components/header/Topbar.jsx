import Avatar from "@/components/avatar/Avatar";
import { Layout } from "antd";
import { Dropdown } from "antd";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaHome, FaUser } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/services/authService";
import StatusCodes from "@/utils/status/StatusCodes";
import { logoutSuccess } from "@/redux/reducer/userSlice";
import { toast } from "react-toastify";

const { Header } = Layout;

const Topbar = ({ collapsed = false, handleCollapse = () => {} }) => {
  const account = useSelector((state) => state.user.account);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout({ _id: account?._id });

    if (res && res.EC === StatusCodes.SUCCESS) {
      dispatch(logoutSuccess());
      navigate("/login", { replace: true });
    }

    if (res && res.EC === StatusCodes.ERRROR) {
      toast.error(res.EM);
    }
  };

  const items = [
    {
      label: (
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Avatar src={account?.avatar || undefined} size={40} />
          </div>
          <div className="space-y-0.5">
            <div className="text-15px font-bold text-black">
              {account?.fullName}
            </div>
            <div className="text-13px text-gray-500">{account?.role}</div>
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
        <Link to="/" className="block py-0.5 text-15px">
          Trang chủ
        </Link>
      ),
      icon: <FaHome />,
      key: "home",
    },
    {
      label: (
        <Link to="/profile" className="block py-0.5 text-15px">
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
        <button
          className="block py-0.5 text-15px text-red-500"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      ),
      icon: <BiLogOutCircle className="h-4 w-4 text-red-500" />,
      key: "signout",
    },
  ];

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
              <Avatar src={account?.avatar || undefined} size={42} />
              <span className="text-15px font-medium text-black group-hover:text-main">
                {account?.fullName}
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
