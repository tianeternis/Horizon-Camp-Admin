import { useDynamicTitle } from "@/hooks";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import { Image } from "antd";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { LuBadgePlus } from "react-icons/lu";
import { useState } from "react";

const DATA_LENGTH = 40;
const PAGE_SIZE = 10;

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

const dataSource = Array.from({
  length: DATA_LENGTH,
}).map((_, i) => ({
  key: i,
  name: `Naturehike ${i}`,
  image: "https://dioutdoor.vn/media/2020/08/logo-brand-naturehike.png.webp",
  description:
    "Naturehike là một thương hiệu sản phẩm thiết bị, dụng cụ, lều trại, phụ kiện ngoài trời chuyên nghiệp. Naturehike cam kết cung cấp các sản phẩm ngoài trời nhẹ và chất lượng cao. Naturehike là một doanh nghiệp thương hiệu chuyên nghiên cứu & phát triển sản phẩm, thiết kế và sản xuất. Naturehike cung cấp các sản phẩm đi bộ đường dài, leo núi, cắm trại và các sản phẩm thể thao ngoài trời khác. Ban có thể mua sản phẩm của naturehike chính hãng tại Việt nam.",
  createdAt: new Date(),
}));

const Brand = ({}) => {
  useDynamicTitle("Quản lý thương hiệu");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWords, setSearchKeyWords] = useState("");

  const handleReset = () => {
    setCurrentPage(1);
    setSearchKeyWords("");
  };

  return (
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
        }}
        pagination={{
          hasPagination: true,
          current: currentPage,
          onChange: (page) => setCurrentPage(+page),
          total: DATA_LENGTH,
          pageSize: PAGE_SIZE,
          showTotal: (total) => `Tổng thương hiệu: ${total}`,
        }}
        search={{
          hasSearchInput: true,
          value: searchKeyWords,
          setValue: setSearchKeyWords,
          placeholder: "Tìm kiếm theo Tên thương hiệu hoặc Mô tả",
          width: 360,
          onSubmit: () => console.log(searchKeyWords),
        }}
        reset={{ hasResetButton: true, onClick: handleReset }}
        crudButton={{
          hasCRUDButton: true,
          buttonsMenu: [
            {
              title: "Thêm thương hiệu",
              icon: <LuBadgePlus />,
              onClick: () => console.log("Thêm thương hiệu mới"),
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
  );
};

export default Brand;
