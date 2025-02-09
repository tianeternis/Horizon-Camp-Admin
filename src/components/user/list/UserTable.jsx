import "@/assets/css/table.css";
import DataDisplayOptions from "@/components/table/options/DataDisplayOptions";
import FilterMenu from "@/components/table/filter/FilterMenu";
import SearchInput from "@/components/table/search/SearchInput";
import Avatar from "@/components/avatar/Avatar";
import { BUTTON_HEIGHT } from "@/components/table/constants";
import {
  formatDateToDDMMYYYY,
  formatDateToHHMMDDMMYYYY,
} from "@/utils/format/date";
import { useState } from "react";
import { FaUsers, FaTransgenderAlt } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { Empty, Table, Tag, Tooltip } from "antd";

const PAGE_SIZE = 10;

const FILTER_KEY = {
  role: "role",
  gender: "gender",
};

const roles = [
  { key: "customer", label: "Khách hàng" },
  { key: "staff", label: "Nhân viên" },
  { key: "admin", label: "Quản trị viên" },
];

const genders = [
  { key: "male", label: "Nam" },
  { key: "female", label: "Nữ" },
  { key: "other", label: "Khác" },
];

const columns = [
  {
    key: "STT",
    title: "STT",
    dataIndex: "STT",
    width: 50,
    align: "center",
    render: (_, __, index) => <span>{index}</span>,
  },
  {
    key: "fullname",
    title: "Người dùng",
    dataIndex: "fullname",
    align: "center",
    render: (_, record) => (
      <div className="flex items-center gap-2.5">
        <Avatar src={record?.avatar || undefined} size={36} />
        <span className="font-semibold">{record?.fullname}</span>
      </div>
    ),
  },
  {
    key: "email",
    title: "Email",
    dataIndex: "email",
  },
  {
    key: "phone",
    title: "Số điện thoại",
    dataIndex: "phone",
    width: 110,
  },
  {
    key: "birthday",
    title: "Ngày sinh",
    dataIndex: "birthday",
    width: 100,
    render: (birthday) => formatDateToDDMMYYYY(birthday),
  },
  {
    key: "gender",
    title: "Giới tính",
    dataIndex: "gender",
    width: 75,
    render: (gender) =>
      gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác",
  },
  {
    key: "address",
    title: "Địa chỉ",
    dataIndex: "address",
  },
  {
    key: "role",
    title: "Vai trò",
    dataIndex: "role",
    width: 125,
    render: ({ key, value }) => (
      <Tag
        color={key === "customer" ? "green" : key === "staff" ? "blue" : "gold"}
      >
        <span className="uppercase">{value}</span>
      </Tag>
    ),
  },
  {
    key: "createdAt",
    title: "Ngày tạo",
    dataIndex: "createdAt",
    width: 140,
    render: (createdAt) => formatDateToHHMMDDMMYYYY(createdAt),
  },
  {
    key: "actions",
    title: "Hành động",
    dataIndex: "actions",
    width: 90,
    render: () => (
      <div className="flex items-center justify-center gap-2.5">
        <Tooltip title="Chỉnh sửa">
          <button className="text-xl text-green-600">
            <BiEditAlt />
          </button>
        </Tooltip>
        <Tooltip title="Xóa">
          <button className="text-xl text-red-600">
            <BiTrash />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

const dataSource = Array.from({
  length: 40,
}).map((_, i) => ({
  key: i,
  fullname: `Nguyễn Thiên Vũ ${i}`,
  avatar: "https://dongvat.edu.vn/upload/2025/01/avatar-vo-tri-meo-01.webp",
  email: "nguyenthienvu@gmail.com",
  phone: "0123456789",
  birthday: new Date(),
  gender: "male",
  address: `Nguyễn Văn Cừ, Xuân Khánh, Cần Thơ ${i}`,
  role: { key: "admin", value: "Quản trị viên" },
  createdAt: new Date(),
}));

const defaultDataOptionsCheckedList = columns.map((item) => item.key);

const UserTable = ({}) => {
  const [dataOptionscheckedList, setDataOptionsCheckedList] = useState(
    defaultDataOptionsCheckedList,
  );
  const [filter, setFilter] = useState({
    [FILTER_KEY.role]: { key: "default", label: "Chọn vai trò" },
    [FILTER_KEY.gender]: { key: "default", label: "Chọn giới tính" },
  });
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !dataOptionscheckedList.includes(item.key),
  }));

  const handleSelectFilter = (filterKey, value) => {
    setFilter((prev) => ({ ...prev, [filterKey]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <DataDisplayOptions
            columns={columns}
            checkedList={dataOptionscheckedList}
            setCheckedList={setDataOptionsCheckedList}
          />
          <FilterMenu
            title="Chọn vai trò"
            icon={<FaUsers />}
            menuItems={roles}
            selectedKey={filter?.[FILTER_KEY.role]}
            setSelectedKey={(value) =>
              handleSelectFilter(FILTER_KEY.role, value)
            }
          />
          <FilterMenu
            title="Chọn giới tính"
            icon={<FaTransgenderAlt />}
            menuItems={genders}
            selectedKey={filter?.[FILTER_KEY.gender]}
            setSelectedKey={(value) =>
              handleSelectFilter(FILTER_KEY.gender, value)
            }
          />
          <SearchInput
            value={searchKeyWords}
            setValue={setSearchKeyWords}
            placeholder="Tìm kiếm theo Họ và tên, Email hoặc Địa chỉ"
            onSubmit={() => console.log(searchKeyWords)}
          />
        </div>
        <div style={{ height: BUTTON_HEIGHT }}>
          <button className="flex h-full items-center justify-center gap-2 rounded-md bg-main px-6 text-white hover:opacity-80">
            <HiMiniUserPlus className="text-lg" />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>
      <Table
        columns={newColumns}
        dataSource={dataSource}
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
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          // total: 46,
          showSizeChanger: false,
          showTotal: (total) => `Tổng người dùng: ${total}`,
          onChange: (page) => setCurrentPage(page),
          style: { marginBottom: 0, marginTop: 24 },
        }}
        scroll={{ y: 371 }}
        locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        className="custom-table"
      />
    </div>
  );
};
export default UserTable;
