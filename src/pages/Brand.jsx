import { useDynamicTitle } from "@/hooks";
import { PAGE_SIZE } from "@/constants";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import AddBrandModal from "@/components/brand/AddBrandModal";
import EditBrandModal from "@/components/brand/EditBrandModal";
import { getBrands } from "@/services/brandService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Image } from "antd";
import { BiEditAlt } from "react-icons/bi";
import { LuBadgePlus } from "react-icons/lu";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const columns = [
  {
    key: "image",
    title: "Hình ảnh minh họa",
    dataIndex: "image",
    align: "center",
    width: 150,
    render: (_, record) => <Image src={record?.image} />,
  },
  {
    key: "name",
    title: "Tên thương hiệu",
    dataIndex: "name",
    align: "center",
    width: "15%",
    render: (value) => <div className="text-center font-semibold">{value}</div>,
  },
  {
    key: "description",
    title: "Mô tả thương hiệu",
    dataIndex: "description",
    align: "center",
    width: "50%",
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

const Brand = ({}) => {
  useDynamicTitle("Quản lý thương hiệu");

  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, data: null });

  const fetchBrands = async (search, page, limit) => {
    setLoading(true);

    const res = await getBrands(search, page, limit);

    if (res && res.EC === StatusCodes.SUCCESS) {
      const data = res.DT?.data || [];

      const newData = data?.map((item) => ({
        ...item,
        key: item?._id,
        image: item?.image?.path,
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
    fetchBrands(searchKeyWords, currentPage, PAGE_SIZE);
  }, []);

  const handleChangePage = async (page) => {
    setCurrentPage(page);
    await fetchBrands(searchKeyWords, page, PAGE_SIZE);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchBrands(searchKeyWords, 1, PAGE_SIZE);
  };

  const handleReset = async () => {
    setCurrentPage(1);
    setSearchKeyWords("");
    await fetchBrands("", 1, PAGE_SIZE);
  };

  return (
    <div>
      <ManagementContentLayout title="Quản lý thương hiệu">
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
            showTotal: (total) => `Tổng thương hiệu: ${total}`,
          }}
          search={{
            hasSearchInput: true,
            value: searchKeyWords,
            setValue: setSearchKeyWords,
            placeholder: "Tìm kiếm theo Tên thương hiệu hoặc Mô tả",
            width: 360,
            onSubmit: () => handleSearch(),
          }}
          reset={{ hasResetButton: true, onClick: handleReset }}
          crudButton={{
            hasCRUDButton: true,
            buttonsMenu: [
              {
                title: "Thêm thương hiệu",
                icon: <LuBadgePlus />,
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
              },
            ],
            widthColumn: 80,
          }}
        />
      </ManagementContentLayout>
      {showAddModal && (
        <AddBrandModal
          open={showAddModal}
          handleClose={() => setShowAddModal(false)}
          refetch={handleReset}
        />
      )}
      {editModal.show && (
        <EditBrandModal
          open={editModal.show}
          handleClose={() => setEditModal({ show: false, data: null })}
          brandID={editModal.data?._id}
          refetch={async () =>
            await fetchBrands(searchKeyWords, currentPage, PAGE_SIZE)
          }
        />
      )}
    </div>
  );
};

export default Brand;
