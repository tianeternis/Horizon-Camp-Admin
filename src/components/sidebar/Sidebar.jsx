import "@/assets/css/scrollbar.css";
import logo from "@/assets/images/logo.webp";
import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";

const DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 90;

const Sidebar = ({ expand = true }) => {
  const openedMixin = (theme) => ({
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    width: MINI_DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
  });

  return (
    <div className="sidebar flex bg-white">
      <Drawer
        variant="permanent"
        sx={[
          expand
            ? (theme) => ({
                ...openedMixin(theme),
                "& .MuiDrawer-paper": { ...openedMixin(theme) },
              })
            : (theme) => ({
                ...closedMixin(theme),
                "& .MuiDrawer-paper": { ...closedMixin(theme) },
              }),
          { "& .MuiDrawer-paper": { border: "none" } },
        ]}
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
                className={`h-auto ${expand ? "w-20" : "w-12"}`}
              />
            </div>
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="sticky bottom-0 z-50 flex items-center justify-center bg-white py-6">
          <button className="hover:text-main flex items-center justify-center gap-2.5 text-gray-400">
            <IoLogOut className="h-7 w-7 shrink-0" />
            <span className={`font-semibold ${expand ? "inline" : "hidden"}`}>
              Đăng xuất
            </span>
          </button>
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
