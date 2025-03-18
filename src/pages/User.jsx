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
import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "@/services/userService";
import StatusCodes from "@/utils/status/StatusCodes";
import { PAGE_SIZE } from "@/constants";
import { USER_ROLE } from "@/components/user/constants";
import AddUserModal from "@/components/user/modal/AddUserModal";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { toast } from "react-toastify";
import EditUserModal from "@/components/user/modal/EditUserModal";

const FILTER_KEY = {
  role: "role",
  gender: "gender",
  status: "status",
};

const roles = [
  { key: "all", label: "Tất cả vai trò" },
  { key: "customer", label: "Khách hàng" },
  { key: "staff", label: "Nhân viên" },
  { key: "admin", label: "Quản trị viên" },
];

const genders = [
  { key: "all", label: "Tất cả giới tính" },
  { key: "male", label: "Nam" },
  { key: "female", label: "Nữ" },
  { key: "other", label: "Khác" },
];

const statuses = [
  { key: "all", label: "Tất cả trạng thái" },
  { key: "active", label: "Đã kích hoạt" },
  { key: "inactive", label: "Chưa kích hoạt" },
];

const sorts = [
  { key: "newest", label: "Tạo gần đây" },
  { key: "oldest", label: "Tạo lâu nhất" },
];

const DEFAULT_FILTER = {
  [FILTER_KEY.role]: roles[0],
  [FILTER_KEY.gender]: genders[0],
  [FILTER_KEY.status]: statuses[0],
};

const DEFAULT_SORT = sorts[0];

const columns = [
  {
    key: "user",
    title: "Người dùng",
    dataIndex: "user",
    align: "center",
    render: (_, record) => (
      <div className="flex items-center gap-2.5">
        <Avatar src={record?.avatar || undefined} size={36} />
        <span className="font-semibold">{record?.fullName}</span>
      </div>
    ),
  },
  {
    key: "email",
    title: "Email",
    dataIndex: "email",
    align: "center",
  },
  {
    key: "phone",
    title: "Số điện thoại",
    dataIndex: "phone",
    width: 110,
    align: "center",
  },
  {
    key: "birthday",
    title: "Ngày sinh",
    dataIndex: "birthday",
    width: 100,
    align: "center",
    render: (birthday) => formatDateToDDMMYYYY(birthday),
  },
  {
    key: "gender",
    title: "Giới tính",
    dataIndex: "gender",
    width: 75,
    align: "center",
  },
  {
    key: "role",
    title: "Vai trò",
    dataIndex: "role",
    width: 125,
    align: "center",
    render: (role) => (
      <Tag
        color={
          role === USER_ROLE.customer
            ? "purple"
            : role === USER_ROLE.staff
              ? "blue"
              : "gold"
        }
      >
        <span className="uppercase">{role}</span>
      </Tag>
    ),
  },
  {
    key: "statue",
    title: "Trạng thái",
    dataIndex: "statue",
    width: 160,
    align: "center",
    render: (_, record) => (
      <Tag color={record?.active ? "green" : "red"}>
        <span className="uppercase">
          {record?.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
        </span>
      </Tag>
    ),
  },
  {
    key: "createdAt",
    title: "Ngày tạo",
    dataIndex: "createdAt",
    width: 140,
    align: "center",
    render: (createdAt) => formatDateToHHMMDDMMYYYY(createdAt),
  },
];

const User = ({}) => {
  useDynamicTitle("Người dùng");

  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, data: null });
  const [editModal, setEditModal] = useState({ show: false, data: null });

  const fetchUser = async (search, role, status, gender, sort, page, limit) => {
    setLoading(true);

    const res = await getUsers(search, role, status, gender, sort, page, limit);

    if (res && res.EC === StatusCodes.SUCCESS) {
      setDataSource(res.DT?.data);
      setTotalPages(res.DT?.pagination?.total);
    }

    if (res && res.EC === StatusCodes.ERRROR) {
      toast.error(res.EM);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser(
      searchKeyWords,
      filter?.[FILTER_KEY.role]?.key,
      filter?.[FILTER_KEY.status]?.key,
      filter?.[FILTER_KEY.gender]?.key,
      sort?.key,
      currentPage,
      PAGE_SIZE,
    );
  }, []);

  const handleSelectFilter = async (filterKey, value) => {
    setFilter((prev) => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
    await fetchUser(
      searchKeyWords,
      filterKey === FILTER_KEY.role
        ? value?.key
        : filter?.[FILTER_KEY.role]?.key,
      filterKey === FILTER_KEY.status
        ? value?.key
        : filter?.[FILTER_KEY.status]?.key,
      filterKey === FILTER_KEY.gender
        ? value?.key
        : filter?.[FILTER_KEY.gender]?.key,
      sort?.key,
      1,
      PAGE_SIZE,
    );
  };

  const handleSelectSort = async (value) => {
    setSort(value);
    setCurrentPage(1);
    await fetchUser(
      searchKeyWords,
      filter?.[FILTER_KEY.role]?.key,
      filter?.[FILTER_KEY.status]?.key,
      filter?.[FILTER_KEY.gender]?.key,
      value?.key,
      1,
      PAGE_SIZE,
    );
  };

  const handleChangePage = async (page) => {
    setCurrentPage(page);
    await fetchUser(
      searchKeyWords,
      filter?.[FILTER_KEY.role]?.key,
      filter?.[FILTER_KEY.status]?.key,
      filter?.[FILTER_KEY.gender]?.key,
      sort?.key,
      page,
      PAGE_SIZE,
    );
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchUser(
      searchKeyWords,
      filter?.[FILTER_KEY.role]?.key,
      filter?.[FILTER_KEY.status]?.key,
      filter?.[FILTER_KEY.gender]?.key,
      sort?.key,
      1,
      PAGE_SIZE,
    );
  };

  const handleReset = async () => {
    setCurrentPage(1);
    setFilter(DEFAULT_FILTER);
    setSearchKeyWords("");
    setSort(DEFAULT_SORT);
    await fetchUser(
      null,
      DEFAULT_FILTER?.[FILTER_KEY.role]?.key,
      DEFAULT_FILTER?.[FILTER_KEY.status]?.key,
      DEFAULT_FILTER?.[FILTER_KEY.gender]?.key,
      DEFAULT_SORT?.key,
      1,
      PAGE_SIZE,
    );
  };

  const handleDeleteUser = async () => {
    if (deleteModal.data) {
      const res = await deleteUser(deleteModal.data?._id);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.error(res.EM);
        setDeleteModal({ show: false, data: null });
        await handleReset();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
    }
  };

  return (
    <div>
      <ManagementContentLayout title="Người dùng">
        <ManagementDataTable
          table={{
            columns,
            dataSource,
            hasIndexColumn: true,
            scroll: {
              hasScroll: true,
              scrollSetting: { scrollToFirstRowOnChange: true, y: 363 },
            },
            loading: loading,
          }}
          pagination={{
            hasPagination: true,
            current: currentPage,
            onChange: (page) => handleChangePage(+page),
            total: totalPages,
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
              {
                title: "Chọn trạng thái",
                menuItems: statuses,
                selectedKey: filter?.[FILTER_KEY.status],
                setSelectedKey: (value) =>
                  handleSelectFilter(FILTER_KEY.status, value),
              },
            ],
          }}
          sortMenu={{
            hasSortMenu: true,
            menu: [
              {
                title: "Sắp xếp",
                menuItems: sorts,
                selectedKey: sort,
                setSelectedKey: (value) => handleSelectSort(value),
              },
            ],
          }}
          search={{
            hasSearchInput: true,
            value: searchKeyWords,
            setValue: setSearchKeyWords,
            placeholder: "Tìm kiếm theo Họ và tên hoặc Email",
            width: 360,
            onSubmit: () => handleSearch(),
          }}
          reset={{ hasResetButton: true, onClick: handleReset }}
          crudButton={{
            hasCRUDButton: true,
            buttonsMenu: [
              {
                title: "Thêm người dùng",
                icon: <HiMiniUserPlus />,
                onClick: () => setShowAddModal(true),
              },
            ],
          }}
          actions={{
            hasActions: true,
            actionsMenu: [
              {
                title: "Chỉnh sửa",
                icon: <BiEditAlt className="text-green-600" />,
                onClick: (data) => setEditModal({ show: true, data }),
                showAction: (data) =>
                  [USER_ROLE.staff, USER_ROLE.admin].includes(data?.role),
              },
              {
                title: "Xóa",
                icon: <BiTrash className="text-red-600" />,
                onClick: (data) => setDeleteModal({ show: true, data }),
                showAction: (data) => data?.role === USER_ROLE.staff,
              },
            ],
            widthColumn: 90,
          }}
        />
      </ManagementContentLayout>
      {showAddModal && (
        <AddUserModal
          open={showAddModal}
          handleClose={() => setShowAddModal(false)}
          refetch={handleReset}
        />
      )}
      {deleteModal.show && deleteModal.data && (
        <ConfirmModal
          open={deleteModal.show}
          handleClose={() => setDeleteModal({ show: false, data: null })}
          content={`Bạn có chắc chắn muốn xóa người dùng ${deleteModal.data?._id} không?`}
          handleOK={handleDeleteUser}
        />
      )}
      {editModal.show && editModal.data && (
        <EditUserModal
          open={editModal.show}
          handleClose={() => setEditModal({ show: false, data: null })}
          userID={editModal.data?._id}
          refetch={async () =>
            await fetchUser(
              searchKeyWords,
              filter?.[FILTER_KEY.role]?.key,
              filter?.[FILTER_KEY.status]?.key,
              filter?.[FILTER_KEY.gender]?.key,
              sort?.key,
              currentPage,
              PAGE_SIZE,
            )
          }
        />
      )}
    </div>
  );
};
export default User;
