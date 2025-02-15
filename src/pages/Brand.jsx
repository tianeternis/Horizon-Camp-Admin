import { useDynamicTitle } from "@/hooks";
import { PAGE_SIZE } from "@/constants";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import AddBrandModal from "@/components/brand/AddBrandModal";
import { Image } from "antd";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { LuBadgePlus } from "react-icons/lu";
import { useCallback, useEffect, useState } from "react";
import { getBrands } from "@/services/brandService";
import StatusCodes from "@/utils/status/StatusCodes";
import { toast } from "react-toastify";
import _ from "lodash";

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

// const dataSource = Array.from({
//   length: DATA_LENGTH,
// }).map((_, i) => ({
//   key: i,
//   name: `Naturehike ${i}`,
//   image: "https://dioutdoor.vn/media/2020/08/logo-brand-naturehike.png.webp",
//   description:
//     "Naturehike là một thương hiệu sản phẩm thiết bị, dụng cụ, lều trại, phụ kiện ngoài trời chuyên nghiệp. Naturehike cam kết cung cấp các sản phẩm ngoài trời nhẹ và chất lượng cao. Naturehike là một doanh nghiệp thương hiệu chuyên nghiên cứu & phát triển sản phẩm, thiết kế và sản xuất. Naturehike cung cấp các sản phẩm đi bộ đường dài, leo núi, cắm trại và các sản phẩm thể thao ngoài trời khác. Ban có thể mua sản phẩm của naturehike chính hãng tại Việt nam.",
//   createdAt: new Date(),
// }));

const Brand = ({}) => {
  useDynamicTitle("Quản lý thương hiệu");

  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  console.log(currentPage);

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

  // const fetchBrandsDebounced = useCallback(_.debounce(fetchBrands, 300), []);

  useEffect(() => {
    fetchBrands(searchKeyWords, currentPage, PAGE_SIZE);
  }, []);

  const handleChangePage = async (page) => {
    await fetchBrands(searchKeyWords, page, PAGE_SIZE);
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    await fetchBrands(searchKeyWords, 1, PAGE_SIZE);
    setCurrentPage(1);
  };

  const handleReset = async () => {
    await fetchBrands("", 1, PAGE_SIZE);
    setCurrentPage(1);
    setSearchKeyWords("");
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
                onClick: (data) => console.log("Sửa ", data),
              },
              {
                title: "Xóa",
                icon: <BiTrash className="text-red-600" />,
                onClick: (data) => console.log("Xóa ", data),
              },
            ],
            widthColumn: 90,
          }}
        />
      </ManagementContentLayout>
      {showAddModal && (
        <AddBrandModal
          open={showAddModal}
          handleClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Brand;
