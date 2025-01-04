import Drawer from "@mui/material/Drawer";

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
      ]}
    >
      {/* <DrawerItems expand={expand} /> */}
    </Drawer>
  );
};

export default Sidebar;
