import { useDynamicTitle } from "@/hooks";
import { PAGE_SIZE } from "@/constants";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import { Tag } from "antd";
import { FiEye } from "react-icons/fi";
import { MdOutlinePayments } from "react-icons/md";
import { formatCurrency } from "@/utils/format/currency";
import {
  ORDER_STATUS,
  OrderStatus,
  PAYMENT_STATUS,
  PaymentMethod,
  PaymentStatus,
} from "@/utils/order";
import { useEffect, useState } from "react";
import { getOrders } from "@/services/orderService";
import StatusCodes from "@/utils/status/StatusCodes";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import ViewOrderDetailModal from "@/components/order/modal/ViewOrderDetailModal";

const FILTER_KEY = {
  paymentMethod: "paymentMethod",
  paymentStatus: "paymentStatus",
};

const orderStatuses = [
  {
    key: "all",
    label: "Tất cả",
  },
  {
    key: OrderStatus.pending,
    label: "Chờ xác nhận",
  },
  {
    key: OrderStatus.preparing,
    label: "Đang chuẩn bị",
  },
  {
    key: OrderStatus.delivering,
    label: "Đang vận chuyển",
  },
  {
    key: OrderStatus.completed,
    label: "Hoàn thành",
  },
  {
    key: OrderStatus.canceled,
    label: "Đã hủy",
  },
];

const paymentMethods = [
  { key: "all", label: "Tất cả phương thức thanh toán" },
  { key: PaymentMethod.COD, label: "Thanh toán khi nhận hàng" },
  { key: PaymentMethod.VNPAY, label: "Thanh toán qua VNPay" },
];

const paymentStatuses = [
  { key: "all", label: "Tất cả trạng thái thanh toán" },
  { key: PaymentStatus.paid, label: "Đã thanh toán" },
  { key: PaymentStatus.notPaid, label: "Chưa thanh toán" },
  { key: PaymentStatus.fail, label: "Thanh toán thất bại" },
];

const sorts = [
  { key: "newest", label: "Đơn hàng mới nhất" },
  { key: "oldest", label: "Đơn hàng cũ nhất" },
];

const DEFAULT_SORT = sorts[0];
const DEFAULT_FILTER = {
  [FILTER_KEY.paymentMethod]: paymentMethods[0],
  [FILTER_KEY.paymentStatus]: paymentStatuses[0],
};
const DEFAULT_ORDER_STATUS = orderStatuses[0]?.key;

const columns = [
  {
    key: "_id",
    title: "Mã đơn hàng",
    dataIndex: "_id",
    align: "center",
    width: 180,
  },
  {
    key: "customer",
    title: "Khách hàng",
    dataIndex: "customer",
    align: "center",
    render: (_, record) => (
      <div className="space-y-1 text-center">
        <div className="font-semibold">{record?.user?.fullName}</div>
        <div className="text-gray-600">{record?.user?.email}</div>
      </div>
    ),
  },
  {
    key: "orderDate",
    title: "Ngày đặt hàng",
    dataIndex: "orderDate",
    align: "center",
    width: 150,
    render: (value) => formatDateToHHMMDDMMYYYY(value),
  },
  {
    key: "orderTotal",
    title: "Tổng thanh toán",
    dataIndex: "orderTotal",
    align: "center",
    render: (value) => (
      <span className="font-bold">{formatCurrency(value)}</span>
    ),
  },
  {
    key: "paymentMethod",
    title: "Phương thức thanh toán",
    dataIndex: "paymentMethod",
    align: "center",
    width: 100,
    render: (value) => (
      <Tag color={value === "COD" ? "orange" : "blue"}>{value}</Tag>
    ),
  },
  {
    key: "paymentStatus",
    title: "Trạng thái thanh toán",
    dataIndex: "paymentStatus",
    align: "center",
    width: 150,
    render: (value) => (
      <Tag
        color={
          value === PAYMENT_STATUS.PAID
            ? "green"
            : value === PAYMENT_STATUS.NOT_PAID
              ? "purple"
              : "red"
        }
      >
        {value}
      </Tag>
    ),
  },
  {
    key: "orderStatus",
    title: "Trạng thái đơn hàng",
    dataIndex: "orderStatus",
    align: "center",
    width: 140,
    render: (value) => (
      <Tag
        color={
          value === ORDER_STATUS.PENDING
            ? "blue"
            : value === ORDER_STATUS.PREPARING
              ? "orange"
              : value === ORDER_STATUS.DELIVERING
                ? "gold"
                : value === ORDER_STATUS.COMPLETED
                  ? "success"
                  : "red"
        }
      >
        {value}
      </Tag>
    ),
  },
];

const Order = ({}) => {
  useDynamicTitle("Quản lý đơn hàng");

  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [orderStatus, setOrderStatus] = useState(DEFAULT_ORDER_STATUS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [viewModal, setViewModal] = useState({ show: false, data: null });

  const [loading, setLoading] = useState(false);

  const fetchOrders = async (
    orderStatus,
    paymentMethod,
    paymentStatus,
    sort,
    search,
    page,
    limit,
  ) => {
    setLoading(true);

    const res = await getOrders(
      orderStatus,
      paymentMethod,
      paymentStatus,
      sort,
      search,
      page,
      limit,
    );

    if (res && res.EC === StatusCodes.SUCCESS) {
      setDataSource(res.DT?.data);
      setTotalPages(res.DT?.pagination?.total);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(
      orderStatus,
      filter?.[FILTER_KEY.paymentMethod]?.key,
      filter?.[FILTER_KEY.paymentStatus]?.key,
      sort?.key,
      searchKeyWords,
      currentPage,
      PAGE_SIZE,
    );
  }, []);

  const handleSelectFilter = async (filterKey, value) => {
    setFilter((prev) => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
    await fetchOrders(
      orderStatus,
      filterKey === FILTER_KEY.paymentMethod
        ? value?.key
        : filter?.[FILTER_KEY.paymentMethod]?.key,
      filterKey === FILTER_KEY.paymentStatus
        ? value?.key
        : filter?.[FILTER_KEY.paymentStatus]?.key,
      sort?.key,
      searchKeyWords,
      1,
      PAGE_SIZE,
    );
  };

  const handleChangePage = async (page) => {
    setCurrentPage(page);
    await fetchOrders(
      orderStatus,
      filter?.[FILTER_KEY.paymentMethod]?.key,
      filter?.[FILTER_KEY.paymentStatus]?.key,
      sort?.key,
      searchKeyWords,
      page,
      PAGE_SIZE,
    );
  };

  const handleSelectSort = async (value) => {
    setSort(value);
    setCurrentPage(1);
    await fetchOrders(
      orderStatus,
      filter?.[FILTER_KEY.paymentMethod]?.key,
      filter?.[FILTER_KEY.paymentStatus]?.key,
      value?.key,
      searchKeyWords,
      1,
      PAGE_SIZE,
    );
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchOrders(
      orderStatus,
      filter?.[FILTER_KEY.paymentMethod]?.key,
      filter?.[FILTER_KEY.paymentStatus]?.key,
      sort?.key,
      searchKeyWords,
      1,
      PAGE_SIZE,
    );
  };

  const handleReset = async () => {
    setFilter(DEFAULT_FILTER);
    setSort(DEFAULT_SORT);
    setSearchKeyWords("");
    setCurrentPage(1);
    await fetchOrders(
      orderStatus,
      DEFAULT_FILTER?.[FILTER_KEY.paymentMethod]?.key,
      DEFAULT_FILTER?.[FILTER_KEY.paymentStatus]?.key,
      DEFAULT_SORT?.key,
      null,
      1,
      PAGE_SIZE,
    );
  };

  const handleChangeOrderStatus = async (key) => {
    setOrderStatus(key);
    setFilter(DEFAULT_FILTER);
    setSort(DEFAULT_SORT);
    setSearchKeyWords("");
    setCurrentPage(1);
    await fetchOrders(
      key,
      DEFAULT_FILTER?.[FILTER_KEY.paymentMethod]?.key,
      DEFAULT_FILTER?.[FILTER_KEY.paymentStatus]?.key,
      DEFAULT_SORT?.key,
      null,
      1,
      PAGE_SIZE,
    );
  };

  return (
    <div>
      <ManagementContentLayout title="Quản lý đơn hàng">
        <div className="pb-4">
          <ul className="flex w-full items-center overflow-x-auto overflow-y-hidden rounded-sm bg-gray-200">
            {orderStatuses.map((status, i) => {
              return (
                <li
                  key={`${status.key}_${i}`}
                  className="flex-1 cursor-pointer text-nowrap px-3 py-3 text-center text-sm font-medium transition-colors duration-200"
                  style={
                    orderStatus === status.key ? { background: "#d1d5db" } : {}
                  }
                  onClick={() => handleChangeOrderStatus(status.key)}
                >
                  {status?.label}
                </li>
              );
            })}
          </ul>
        </div>
        <ManagementDataTable
          table={{
            columns,
            dataSource,
            hasIndexColumn: false,
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
            showTotal: (total) => `Tổng sản phẩm: ${total}`,
          }}
          filterMenu={{
            hasFilterMenu: true,
            menu: [
              {
                title: "Phương thức thanh toán",
                icon: <MdOutlinePayments />,
                menuItems: paymentMethods,
                selectedKey: filter?.[FILTER_KEY.paymentMethod],
                setSelectedKey: (value) =>
                  handleSelectFilter(FILTER_KEY.paymentMethod, value),
              },
              {
                title: "Trạng thái thanh toán",
                menuItems: paymentStatuses,
                selectedKey: filter?.[FILTER_KEY.paymentStatus],
                setSelectedKey: (value) =>
                  handleSelectFilter(FILTER_KEY.paymentStatus, value),
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
            placeholder: "Tìm kiếm theo ID đơn hàng hoặc Tên khách hàng",
            width: 400,
            onSubmit: () => handleSearch(),
          }}
          reset={{ hasResetButton: true, onClick: handleReset }}
          actions={{
            hasActions: true,
            actionsMenu: [
              {
                title: "Xem chi tiết",
                icon: <FiEye className="text-blue-600" />,
                onClick: (data) => setViewModal({ show: true, data }),
              },
            ],
            widthColumn: 60,
          }}
        />
      </ManagementContentLayout>
      {viewModal.show && viewModal.data && (
        <ViewOrderDetailModal
          open={viewModal.show}
          handleClose={() => setViewModal({ show: false, data: null })}
          orderID={viewModal?.data?._id}
        />
      )}
    </div>
  );
};

export default Order;
