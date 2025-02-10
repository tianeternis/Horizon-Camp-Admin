import { useDynamicTitle } from "@/hooks";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import { Image, Tag } from "antd";
import { BiEditAlt, BiSolidCategory, BiTrash } from "react-icons/bi";
import { HiSquaresPlus } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";
import { useState } from "react";

const DATA_LENGTH = 40;
const PAGE_SIZE = 10;

const CATEGORY_LEVEL = [
  { key: "level-1", label: "Danh mục cấp 1" },
  { key: "level-2", label: "Danh mục cấp 2" },
];

const DEFAULT_CATEGORY_LEVEL = {
  key: "default",
  label: "Chọn cấp danh mục",
};

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
    title: "Tên danh mục",
    dataIndex: "name",
    align: "center",
    width: "15%",
    render: (value) => <div className="text-center font-semibold">{value}</div>,
  },
  {
    key: "description",
    title: "Mô tả danh mục",
    dataIndex: "description",
    align: "center",
    width: "50%",
  },
  {
    key: "level",
    title: "Cấp độ",
    dataIndex: "level",
    align: "center",
    width: 80,
    render: ({ key, value }) => (
      <Tag color={key === "level-1" ? "green" : "purple"}>
        <span className="uppercase">{value}</span>
      </Tag>
    ),
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
  name: `Túi ngủ - Đệm ngủ ${i}`,
  image: "https://dioutdoor.vn/media/2023/09/Menu-v23-dem-ngu-tui-ngu.jpg.webp",
  description:
    "Bên ngoài vỏ ngoài túi ngủ thường được làm bằng nylon-ripstop vì nó có độ bền cao chống mài mòn. Ngoài ra Polyester cũng là một chất liệu tốt thường được sử dụng. Vì chúng có khả năng kháng nước tốt nhưng vẫn giữ được tính năng thoát hơi. Túi ngủ để cắm trại ngoài trời đôi khi sẽ sử dụng vải cotton và flannel. Điều này thích hợp cho những nơi không quá lạnh. Lớp vải bên ngoài bằng cotton sẽ giúp túi ngủ thoát hơi tốt hơn. Giúp bạn thoải mái hơn trong điều kiện trong nhà hoặc trong lều. Mặc dù vậy, để cắm trại trong thời tiết ẩm ướt, vải Polyester sẽ vẫn khô nhanh hơn và tốt hơn.",
  level: { key: "level-1", value: "Cấp 1" },
  createdAt: new Date(),
}));

const Category = ({}) => {
  useDynamicTitle("Quản lý danh mục sản phẩm");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [categoryLevel, setCategoryLevel] = useState(DEFAULT_CATEGORY_LEVEL);

  const handleReset = () => {
    setCurrentPage(1);
    setSearchKeyWords("");
    setCategoryLevel(DEFAULT_CATEGORY_LEVEL);
  };

  return (
    <ManagementContentLayout title="Quản lý danh mục sản phẩm">
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
          showTotal: (total) => `Tổng danh mục: ${total}`,
        }}
        filterMenu={{
          hasFilterMenu: true,
          menu: [
            {
              title: "Chọn cấp danh mục",
              icon: <BiSolidCategory />,
              menuItems: CATEGORY_LEVEL,
              selectedKey: categoryLevel,
              setSelectedKey: (value) => setCategoryLevel(value),
            },
          ],
        }}
        search={{
          hasSearchInput: true,
          value: searchKeyWords,
          setValue: setSearchKeyWords,
          placeholder: "Tìm kiếm theo Tên danh mục hoặc Mô tả",
          width: 360,
          onSubmit: () => console.log(searchKeyWords),
        }}
        reset={{ hasResetButton: true, onClick: handleReset }}
        crudButton={{
          hasCRUDButton: true,
          buttonsMenu: [
            {
              title: "Thêm danh mục cấp 1",
              icon: <HiSquaresPlus />,
              onClick: () => console.log("Thêm danh mục cấp 1 mới"),
            },
            {
              title: "Thêm danh mục cấp 2",
              icon: <HiSquaresPlus />,
              onClick: () => console.log("Thêm danh mục cấp 2 mới"),
            },
          ],
        }}
        actions={{
          hasActions: true,
          actionsMenu: [
            {
              title: "Xem danh mục cấp 2",
              icon: <FiEye className="text-blue-600" />,
              onClick: (data) => console.log("Xem danh mục cấp 2  ", data),
              showAction: (data) => data?.level?.key === "level-1",
            },
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
          widthColumn: 110,
        }}
      />
    </ManagementContentLayout>
  );
};

export default Category;
