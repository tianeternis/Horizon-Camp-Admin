import { IoMdOptions } from "react-icons/io";
import { Checkbox, ConfigProvider, Dropdown, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { BUTTON_HEIGHT } from "../constants";

const DataDisplayOptions = ({
  columns = [],
  checkedList = [],
  setCheckedList = (value) => {},
}) => {
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    return columns?.map((column) => ({
      value: column?.key,
      label: column?.title,
    }));
  }, [columns]);

  const handleMenuClick = (e) => {
    setOpen(true);
  };
  const handleOpenChange = (nextOpen, info) => {
    if (info.source === "trigger" || nextOpen) {
      setOpen(nextOpen);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          controlItemBgHover: "transparent",
        },
      }}
    >
      <Dropdown
        menu={{
          items: [
            {
              key: "dropdown-data-display-options",
              label: (
                <Checkbox.Group
                  value={checkedList}
                  options={options}
                  onChange={(value) => setCheckedList(value)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                />
              ),
            },
          ],
          onClick: handleMenuClick,
        }}
        trigger={["hover"]}
        placement="bottomLeft"
        arrow
        onOpenChange={handleOpenChange}
        open={open}
      >
        <Tooltip title="Tùy chọn hiển thị dữ liệu">
          <button
            className="flex items-center justify-center rounded-md bg-main text-lg text-white hover:opacity-80"
            style={{ width: BUTTON_HEIGHT, height: BUTTON_HEIGHT }}
          >
            <IoMdOptions />
          </button>
        </Tooltip>
      </Dropdown>
    </ConfigProvider>
  );
};

export default DataDisplayOptions;
