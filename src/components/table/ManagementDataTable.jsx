import "@/assets/css/table.css";
import DataDisplayOptions from "./options/DataDisplayOptions";
import FilterMenu from "./filter/FilterMenu";
import SearchInput from "./search/SearchInput";
import { Empty, Table, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { BUTTON_HEIGHT } from "./constants";
import { RiResetLeftFill } from "react-icons/ri";

const DEFAULT_TABLE = {
  columns: [],
  dataSource: [],
  hasIndexColumn: false,
};

const DEFAULT_PAGINATION = {
  hasPagination: false,
  current: 1,
  pageSize: 0,
  total: 0,
  showTotal: (total) => <></>,
  onChange: (page, pageSize) => {},
};

const DEFAULT_FILTER_MENU = {
  hasFilterMenu: false,
  menu: [
    {
      title: "Example",
      icon: <></>,
      menuItems: [{ key: "example", label: "Example" }],
      selectedKey: {},
      setSelectedKey: (value) => {},
    },
  ],
};

const DEFAULT_SEARCH = {
  hasSearchInput: false,
  value: "",
  setValue: (value) => {},
  placeholder: "...",
  width: 400,
  onSubmit: () => {},
};

const DEFAULT_CRUD_BUTTON = {
  hasCRUDButton: false,
  buttonsMenu: [
    {
      title: "CRUD Button",
      icon: <></>,
      onClick: (event) => {},
    },
  ],
};

const DEFAULT_ACTIONS = {
  hasActions: false,
  actionsMenu: [
    {
      title: "Example action",
      icon: <></>,
      onClick: (data) => {},
      showAction: (data) => true,
    },
  ],
  widthColumn: 90,
};

const ManagementDataTable = ({
  table = DEFAULT_TABLE,
  pagination = DEFAULT_PAGINATION,
  filterMenu = DEFAULT_FILTER_MENU,
  search = DEFAULT_SEARCH,
  reset = { hasResetButton: false, onClick: () => {} },
  crudButton = DEFAULT_CRUD_BUTTON,
  actions = DEFAULT_ACTIONS,
  showDataDisplayOptions = true,
}) => {
  const newColumns = [
    ...(table?.hasIndexColumn
      ? [
          {
            key: "STT",
            title: "STT",
            dataIndex: "STT",
            width: 50,
            align: "center",
            render: (_, __, index) =>
              index + (+pagination?.current - 1) * +pagination?.pageSize + 1,
          },
        ]
      : []),
    ...table?.columns,
    ...(actions?.hasActions
      ? [
          {
            key: "actions",
            title: "Hành động",
            dataIndex: "actions",
            width: actions?.widthColumn,
            render: (_, record) => (
              <div className="flex items-center justify-center gap-2.5">
                {actions?.actionsMenu?.map(
                  (action, i) =>
                    (action?.showAction
                      ? action?.showAction(record) === true
                      : true) && (
                      <Tooltip
                        key={`data-table-actions-${action?.title}-${i}`}
                        title={action?.title}
                      >
                        <button
                          className="text-xl"
                          onClick={() => action?.onClick(record)}
                        >
                          {action?.icon}
                        </button>
                      </Tooltip>
                    ),
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  const defaultDataOptionsCheckedList = useMemo(
    () => newColumns?.map((item) => item?.key),
    [],
  );

  const [dataOptionsCheckedList, setDataOptionsCheckedList] = useState(
    defaultDataOptionsCheckedList,
  );

  const displayColumns = newColumns?.map((item) => ({
    ...item,
    hidden: !dataOptionsCheckedList.includes(item?.key),
  }));

  const handleResetDataTable = () => {
    if (showDataDisplayOptions) {
      setDataOptionsCheckedList(defaultDataOptionsCheckedList);
    }

    if (reset?.hasResetButton && reset?.onClick) {
      reset?.onClick();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {showDataDisplayOptions && (
            <DataDisplayOptions
              columns={newColumns}
              checkedList={dataOptionsCheckedList}
              setCheckedList={setDataOptionsCheckedList}
            />
          )}
          {filterMenu?.hasFilterMenu &&
            filterMenu?.menu?.length > 0 &&
            filterMenu?.menu?.map((filter, i) => (
              <FilterMenu
                key={`data-table-filter-menu-for-${filter?.title}-${i}`}
                title={filter?.title}
                icon={filter?.icon}
                menuItems={filter?.menuItems}
                selectedKey={filter?.selectedKey}
                setSelectedKey={filter?.setSelectedKey}
              />
            ))}
          {search?.hasSearchInput && (
            <SearchInput
              value={search?.value}
              setValue={search?.setValue}
              placeholder={search?.placeholder}
              width={search?.width}
              onSubmit={search?.onSubmit}
            />
          )}
          {reset?.hasResetButton && (
            <button
              style={{ height: BUTTON_HEIGHT }}
              className="flex items-center justify-center gap-1.5 rounded-md bg-main px-2.5 text-sm text-white hover:opacity-80"
              onClick={() => handleResetDataTable()}
            >
              <RiResetLeftFill />
              <span className="text-15px">Đặt lại</span>
            </button>
          )}
        </div>
        {crudButton?.hasCRUDButton && (
          <div
            style={{ height: BUTTON_HEIGHT }}
            className="flex items-center gap-2.5"
          >
            {crudButton?.buttonsMenu?.map((btn, i) => (
              <button
                key={`data-table-crud-button-${i}-${btn?.title}`}
                className="flex h-full items-center justify-center gap-2 rounded-md bg-main px-4 text-white hover:opacity-80"
                onClick={btn?.onClick}
              >
                <span className="text-lg">{btn?.icon}</span>
                <span>{btn?.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <Table
        columns={displayColumns}
        dataSource={table.dataSource}
        bordered
        size="middle"
        components={{
          body: {
            row: (props) => (
              <tr {...props} className="duration-150 hover:bg-[#fafafa]" />
            ),
            cell: (props) => <td {...props} className="align-middle" />,
          },
        }}
        pagination={
          pagination?.hasPagination
            ? {
                size: "default",
                style: { marginBottom: 0, marginTop: 24 },
                showSizeChanger: false,
                current: pagination?.current,
                pageSize: pagination?.pageSize,
                total: pagination?.total,
                showTotal: pagination?.showTotal,
                onChange: pagination?.onChange,
              }
            : false
        }
        {...(pagination?.total > 0 ? { scroll: { y: 363 } } : {})}
        locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        className="custom-table"
      />
    </div>
  );
};

export default ManagementDataTable;
