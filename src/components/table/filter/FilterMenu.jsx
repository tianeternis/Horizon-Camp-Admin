import { Dropdown } from "antd";
import { MdFilterAlt } from "react-icons/md";
import { BUTTON_HEIGHT } from "../constants";
import { useMemo } from "react";

const FilterMenu = ({
  menuItems = [{ key: "example", label: "Example" }],
  title = "",
  icon = <MdFilterAlt />,
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
        <span className="text-15px">{icon}</span>
        {selectedKey?.label || title}
      </button>
    </Dropdown>
  );
};

export default FilterMenu;
