import { useDynamicTitle } from "@/hooks";
import { PAGE_SIZE } from "@/constants";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import AddCategoryModal from "@/components/category/AddCategoryModal";
import EditCategoryModal from "@/components/category/EditCategoryModal";
import { getCategories } from "@/services/categoryService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Image } from "antd";
import { BiEditAlt } from "react-icons/bi";
import { HiOutlinePlusCircle, HiSquaresPlus } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProductModal from "@/components/product/AddProductModal";

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
    width: "15%",
    render: (value) => <div className="text-center font-semibold">{value}</div>,
  },
  {
    key: "category",
    title: "Danh mục",
    dataIndex: "category",
    align: "center",
  },
  {
    key: "price",
    title: "Giá bán",
    dataIndex: "price",
    align: "center",
  },
  {
    key: "discount",
    title: "Chiết khấu",
    dataIndex: "discount",
    align: "center",
  },
  {
    key: "status",
    title: "Trạng thái",
    dataIndex: "status",
    align: "center",
  },
  {
    key: "createdAt",
    title: "Ngày tạo",
    dataIndex: "createdAt",
    align: "center",
    width: 140,
    render: (createdAt) => formatDateToHHMMDDMMYYYY(createdAt),
  },
];

const Product = ({}) => {
  useDynamicTitle("Quản lý sản phẩm");

  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, data: null });

  const handleChangePage = async (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
  };

  const handleReset = async () => {
    setCurrentPage(1);
    setSearchKeyWords("");
  };

  return (
    <div>
      <ManagementContentLayout title="Quản lý sản phẩm">
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
            showTotal: (total) => `Tổng sản phẩm: ${total}`,
          }}
          search={{
            hasSearchInput: true,
            value: searchKeyWords,
            setValue: setSearchKeyWords,
            placeholder: "Tìm kiếm theo Mã hoặc Tên sản phẩm",
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
                onClick: (data) => console.log("Xem", data),
              },
              {
                title: "Chỉnh sửa",
                icon: <BiEditAlt className="text-green-600" />,
                onClick: (data) => setEditModal({ show: true, data }),
              },
            ],
            widthColumn: 80,
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
      {/* {editModal.show && (
        <EditCategoryModal
          open={editModal.show}
          handleClose={() => setEditModal({ show: false, data: null })}
          categoryID={editModal.data?._id}
          refetch={async () =>
            await fetchCategories(searchKeyWords, currentPage, PAGE_SIZE)
          }
        />
      )} */}
    </div>
  );
};

export default Product;
