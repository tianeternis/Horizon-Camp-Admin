import { Dropdown } from "antd";
import { BiSort } from "react-icons/bi";
import { BUTTON_HEIGHT } from "../constants";
import { useMemo } from "react";

const SortMenu = ({
  menuItems = [{ key: "example", label: "Example" }],
  title = "",
  selectedKey,
  setSelectedKey = (value) => {},
}) => {
  const itemsObj = useMemo(() => {
    const items = {};
    menuItems?.forEach((item) => {
      if (item?.key) {
        items[item.key] = item;
      }
    });

    return items;
  }, [menuItems]);

  return (
    <Dropdown
      menu={{
        items: menuItems,
        selectable: true,
        onClick: ({ key }) => setSelectedKey(itemsObj?.[key]),
        selectedKeys: selectedKey?.key,
      }}
      trigger={["hover"]}
      placement="bottomLeft"
      arrow
    >
      <button
        className="flex items-center justify-center gap-1.5 rounded-md bg-main px-2.5 text-sm text-white hover:opacity-80"
        style={{ height: BUTTON_HEIGHT }}
      >
        <span className="text-15px">
          <BiSort />
        </span>
        {selectedKey?.label || title}
      </button>
    </Dropdown>
  );
};

export default SortMenu;
