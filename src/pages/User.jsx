import { useDynamicTitle } from "@/hooks";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import Avatar from "@/components/avatar/Avatar";
import {
  formatDateToDDMMYYYY,
  formatDateToHHMMDDMMYYYY,
} from "@/utils/format/date";
import { Tag } from "antd";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { FaTransgenderAlt, FaUsers } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";
import { useState } from "react";

const DATA_LENGTH = 40;
const PAGE_SIZE = 10;

const FILTER_KEY = {
  role: "role",
  gender: "gender",
};

const DEFAULT_FILTER = {
  [FILTER_KEY.role]: { key: "default", label: "Chọn vai trò" },
  [FILTER_KEY.gender]: { key: "default", label: "Chọn giới tính" },
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
];

const dataSource = Array.from({
  length: DATA_LENGTH,
}).map((_, i) => ({
  key: i,
  fullname: `Nguyễn Thiên Vũ ${i}`,
  avatar: "https://dongvat.edu.vn/upload/2025/01/avatar-vo-tri-meo-01.webp",
  email: "nguyenthienvu@gmail.com",
  phone: "0123456789",
  birthday: new Date(),
  gender: "male",
  address: `Nguyễn Văn Cừ, Xuân Khánh, Cần Thơ ${i}`,
  role: { key: "staff", value: "Nhân viên" },
  createdAt: new Date(),
}));

const User = ({}) => {
  useDynamicTitle("Quản lý người dùng");

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [searchKeyWords, setSearchKeyWords] = useState("");

  const handleSelectFilter = (filterKey, value) => {
    setFilter((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleReset = () => {
    setCurrentPage(1);
    setFilter(DEFAULT_FILTER);
    setSearchKeyWords("");
  };

  return (
    <ManagementContentLayout title="Quản lý người dùng">
      <ManagementDataTable
        table={{
          columns,
          dataSource,
          hasIndexColumn: true,
          scroll: {
            hasScroll: true,
            scrollSetting: { scrollToFirstRowOnChange: true, y: 363 },
          },
        }}
        pagination={{
          hasPagination: true,
          current: currentPage,
          onChange: (page) => setCurrentPage(+page),
          total: DATA_LENGTH,
          pageSize: PAGE_SIZE,
          showTotal: (total) => `Tổng người dùng: ${total}`,
        }}
        filterMenu={{
          hasFilterMenu: true,
          menu: [
            {
              title: "Chọn vai trò",
              icon: <FaUsers />,
              menuItems: roles,
              selectedKey: filter?.[FILTER_KEY.role],
              setSelectedKey: (value) =>
                handleSelectFilter(FILTER_KEY.role, value),
            },
            {
              title: "Chọn giới tính",
              icon: <FaTransgenderAlt />,
              menuItems: genders,
              selectedKey: filter?.[FILTER_KEY.gender],
              setSelectedKey: (value) =>
                handleSelectFilter(FILTER_KEY.gender, value),
            },
          ],
        }}
        search={{
          hasSearchInput: true,
          value: searchKeyWords,
          setValue: setSearchKeyWords,
          placeholder: "Tìm kiếm theo Họ và tên, Email hoặc Địa chỉ",
          width: 400,
          onSubmit: () => console.log(searchKeyWords),
        }}
        reset={{ hasResetButton: true, onClick: handleReset }}
        crudButton={{
          hasCRUDButton: true,
          buttonsMenu: [
            {
              title: "Thêm người dùng",
              icon: <HiMiniUserPlus />,
              onClick: () => console.log("Thêm người dùng mới"),
            },
          ],
        }}
        actions={{
          hasActions: true,
          actionsMenu: [
            {
              title: "Chỉnh sửa",
              icon: <BiEditAlt className="text-green-600" />,
              onClick: (data) => console.log("Sửa ", data),
              showAction: (data) =>
                ["staff", "admin"].includes(data?.role?.key),
            },
            {
              title: "Xóa",
              icon: <BiTrash className="text-red-600" />,
              onClick: (data) => console.log("Xóa ", data),
              showAction: (data) => data?.role?.key === "staff",
            },
          ],
          widthColumn: 90,
        }}
      />
    </ManagementContentLayout>
  );
};

export default User;
