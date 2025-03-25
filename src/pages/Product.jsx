import { useDynamicTitle } from "@/hooks";
import { PAGE_SIZE } from "@/constants";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import StatusCodes from "@/utils/status/StatusCodes";
import { Image, Tag } from "antd";
import { BiEditAlt } from "react-icons/bi";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";
import { MdOutlineFilterAlt } from "react-icons/md";
import { RiCouponLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProductModal from "@/components/product/modal/AddProductModal";
import EditProductModal from "@/components/product/modal/EditProductModal";
import ViewProductModal from "@/components/product/modal/ViewProductModal";
import { getProductsForAdmin } from "@/services/productService";
import { formatCurrency } from "@/utils/format/currency";
import ViewDiscountModal from "@/components/product/modal/ViewDiscountModal";

const FILTER_KEY = {
  status: "status",
};

const statuses = [
  { key: "all", label: "Tất cả trạng thái" },
  { key: "visible", label: "Hiển thị sản phẩm" },
  { key: "invisible", label: "Ẩn sản phẩm" },
];

const sorts = [
  { key: "newest", label: "Sản phẩm mới nhất" },
  { key: "oldest", label: "Sản phẩm cũ nhất" },
];

const DEFAULT_FILTER = {
  [FILTER_KEY.status]: statuses[0],
};

const DEFAULT_SORT = sorts[0];

const columns = [
  {
    key: "image",
    title: "Hình ảnh",
    dataIndex: "image",
    align: "center",
    width: 100,
    render: (_, record) => <Image src={record?.image} />,
  },
  {
    key: "name",
    title: "Tên sản phẩm",
    dataIndex: "name",
    align: "center",
    render: (value) => <div className="text-center font-semibold">{value}</div>,
  },
  {
    key: "category",
    title: "Danh mục",
    dataIndex: "category",
    align: "center",
  },
  {
    key: "brand",
    title: "Thương hiệu",
    dataIndex: "brand",
    align: "center",
    width: 100,
    render: (_, record) => <Image src={record?.brand} />,
  },
  {
    key: "price",
    title: "Giá bán",
    dataIndex: "price",
    align: "center",
    render: (_, { variants }) => {
      const first = variants[0]?.price;
      const last = variants[variants?.length - 1]?.price;

      return (
        <span>
          {formatCurrency(first)}
          {first !== last ? ` - ${formatCurrency(last)}` : ""}
        </span>
      );
    },
  },
  {
    key: "discount",
    title: "Chiết khấu đang áp dụng",
    dataIndex: "discount",
    align: "center",
    width: 110,
    render: (value) =>
      value ? (
        <Tag color="pink" style={{ margin: 0 }}>
          {value}%
        </Tag>
      ) : (
        <Tag color="gold" style={{ margin: 0 }}>
          Không có
        </Tag>
      ),
  },
  {
    key: "status",
    title: "Trạng thái",
    dataIndex: "status",
    align: "center",
    width: 95,
    render: (_, { visible }) =>
      visible ? (
        <Tag color="lime" style={{ margin: 0 }}>
          HIỂN THỊ
        </Tag>
      ) : (
        <Tag color="red" style={{ margin: 0 }}>
          ẨN
        </Tag>
      ),
  },
];

const Product = ({}) => {
  useDynamicTitle("Sản phẩm");

  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, data: null });
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  const [viewDiscountModal, setViewDiscountModal] = useState({
    show: false,
    data: null,
  });

  const fetchProducts = async (search, page, limit, status, sort) => {
    setLoading(true);

    const res = await getProductsForAdmin(search, page, limit, status, sort);

    if (res && res.EC === StatusCodes.SUCCESS) {
      const data = res.DT?.data || [];

      const newData = data?.map((item) => ({
        ...item,
        key: item?._id,
      }));

      setDataSource(newData);
      setTotalPages(res.DT?.pagination?.total);
    }

    if (res && res.EC === StatusCodes.ERRROR) {
      toast.error(res.EM);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(
      searchKeyWords,
      currentPage,
      PAGE_SIZE,
      filter[FILTER_KEY.status]?.key,
      sort?.key,
    );
  }, []);

  const handleSelectFilter = async (filterKey, value) => {
    setFilter((prev) => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
    await fetchProducts(searchKeyWords, 1, PAGE_SIZE, value?.key, sort?.key);
  };

  const handleChangePage = async (page) => {
    setCurrentPage(page);
    await fetchProducts(
      searchKeyWords,
      page,
      PAGE_SIZE,
      filter[FILTER_KEY.status]?.key,
      sort?.key,
    );
  };

  const handleSelectSort = async (value) => {
    setSort(value);
    setCurrentPage(1);
    await fetchProducts(
      searchKeyWords,
      1,
      PAGE_SIZE,
      filter?.[FILTER_KEY.status]?.key,
      value?.key,
    );
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchProducts(
      searchKeyWords,
      1,
      PAGE_SIZE,
      filter[FILTER_KEY.status]?.key,
      sort?.key,
    );
  };

  const handleReset = async () => {
    setCurrentPage(1);
    setSearchKeyWords("");
    setFilter(DEFAULT_FILTER);
    setSort(DEFAULT_SORT);
    await fetchProducts(
      "",
      currentPage,
      PAGE_SIZE,
      DEFAULT_FILTER?.[FILTER_KEY.status]?.key,
      DEFAULT_SORT?.key,
    );
  };

  return (
    <div>
      <ManagementContentLayout title="Sản phẩm">
        <ManagementDataTable
          table={{
            columns,
            dataSource,
            hasIndexColumn: true,
            scroll: {
              hasScroll: true,
              scrollSetting: { scrollToFirstRowOnChange: true, y: 341 },
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
                title: "Chọn trạng thái",
                icon: <MdOutlineFilterAlt />,
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
            placeholder: "Tìm kiếm theo Tên sản phẩm",
            width: 360,
            onSubmit: () => handleSearch(),
          }}
          reset={{ hasResetButton: true, onClick: handleReset }}
          crudButton={{
            hasCRUDButton: true,
            buttonsMenu: [
              {
                title: "Thêm sản phẩm",
                icon: <HiOutlinePlusCircle />,
                onClick: () => setShowAddModal(true),
              },
            ],
          }}
          actions={{
            hasActions: true,
            actionsMenu: [
              {
                title: "Xem chi tiết",
                icon: <FiEye className="text-blue-600" />,
                onClick: (data) => setViewModal({ show: true, data }),
              },
              {
                title: "Chỉnh sửa",
                icon: <BiEditAlt className="text-green-600" />,
                onClick: (data) => setEditModal({ show: true, data }),
              },
              {
                title: "Xem thông tin chiết khấu",
                icon: <RiCouponLine className="text-rose-600" />,
                onClick: (data) => setViewDiscountModal({ show: true, data }),
              },
            ],
            widthColumn: 110,
          }}
        />
      </ManagementContentLayout>
      {showAddModal && (
        <AddProductModal
          open={showAddModal}
          handleClose={() => setShowAddModal(false)}
          refetch={handleReset}
        />
      )}
      {editModal.show && (
        <EditProductModal
          open={editModal.show}
          handleClose={() => setEditModal({ show: false, data: null })}
          productID={editModal.data?._id}
          refetch={async () =>
            await fetchProducts(
              searchKeyWords,
              currentPage,
              PAGE_SIZE,
              filter?.[FILTER_KEY.status]?.key,
              sort?.key,
            )
          }
        />
      )}
      {viewModal.show && (
        <ViewProductModal
          open={viewModal.show}
          handleClose={() => setViewModal({ show: false, data: null })}
          productID={viewModal.data?._id}
        />
      )}
      {viewDiscountModal.show && (
        <ViewDiscountModal
          open={viewDiscountModal.show}
          handleClose={() => setViewDiscountModal({ show: false, data: null })}
          productID={viewDiscountModal.data?._id}
        />
      )}
    </div>
  );
};

export default Product;
