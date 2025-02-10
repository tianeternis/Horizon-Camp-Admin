import { useDynamicTitle } from "@/hooks";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import Avatar from "@/components/avatar/Avatar";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import { Image, Switch, Tag, Tooltip } from "antd";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { MdPublishedWithChanges } from "react-icons/md";
import { HiPlusCircle } from "react-icons/hi2";
import { useState } from "react";
import { FiEye } from "react-icons/fi";

const DATA_LENGTH = 40;
const PAGE_SIZE = 10;

const DEFAULT_STATUS = { key: "default", label: "Chọn trạng thái đăng tải" };

const status = [
  {
    key: "published",
    label: "Đã đăng cẩm nang",
  },
  {
    key: "unpublished",
    label: "Đã gỡ cẩm nang",
  },
];

const columns = [
  {
    key: "author",
    title: "Tác giả",
    dataIndex: "author",
    align: "center",
    render: (_, record) => (
      <div className="flex flex-col items-center justify-center gap-2.5">
        <Avatar src={record?.author?.avatar || undefined} size={36} />
        <span className="font-semibold">{record?.author?.fullname}</span>
      </div>
    ),
  },
  {
    key: "image",
    title: "Hình ảnh minh họa",
    dataIndex: "image",
    align: "center",
    width: 160,
    render: (_, record) => (
      <div className="flex items-center justify-center">
        <Image src={record?.image} />
      </div>
    ),
  },
  {
    key: "title",
    title: "Tiêu đề cẩm nang",
    dataIndex: "title",
    align: "center",
  },
  {
    key: "createdAt",
    title: "Ngày tạo",
    dataIndex: "createdAt",
    width: 140,
    render: (createdAt) => formatDateToHHMMDDMMYYYY(createdAt),
  },
  {
    key: "status",
    title: "Trạng thái",
    dataIndex: "status",
    width: 100,
    render: (_, record) => (
      <Tag color={record?.isPublished ? "green" : "gold"}>
        <span className="uppercase">
          {record?.isPublished ? "Đã đăng" : "Đã gỡ"}
        </span>
      </Tag>
    ),
  },
  {
    key: "publishAt",
    title: "Ngày đăng cuối cùng",
    dataIndex: "publishAt",
    width: 140,
    render: (createdAt) => formatDateToHHMMDDMMYYYY(createdAt),
  },
  {
    key: "updateAt",
    title: "Ngày cập nhật cuối cùng",
    dataIndex: "updateAt",
    width: 140,
    render: (createdAt) => formatDateToHHMMDDMMYYYY(createdAt),
  },
];

const dataSource = Array.from({
  length: DATA_LENGTH,
}).map((_, i) => ({
  key: i,
  author: {
    fullname: `Nguyễn Thiên Vũ ${i}`,
    avatar: "https://dongvat.edu.vn/upload/2025/01/avatar-vo-tri-meo-01.webp",
  },
  image:
    "https://bizweb.dktcdn.net/thumb/large/100/440/011/articles/t3.jpg?v=1635127761927",
  title:
    "Chia sẻ kinh nghiệm cắm trại hồ Dầu Tiếng để có 1 chuyến đi hơn cả mong đợi",
  slug: "chia-se-kinh-nghiem-cam-trai-ho-dau-tieng-de-co-1-chuyen-di-hon-ca-mong-doi",
  isPublished: true,
  publishAt: new Date(),
  updateAt: new Date(),
  createdAt: new Date(),
}));

const PicnicGuide = ({}) => {
  useDynamicTitle("Quản lý người dùng");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_STATUS);
  const [searchKeyWords, setSearchKeyWords] = useState("");

  const handleReset = () => {
    setCurrentPage(1);
    setSelectedStatus(DEFAULT_STATUS);
    setSearchKeyWords("");
  };

  return (
    <ManagementContentLayout title="Quản lý cẩm nang dã ngoại">
      <ManagementDataTable
        table={{
          columns,
          dataSource,
          hasIndexColumn: true,
          scroll: {
            hasScroll: true,
            scrollSetting: { scrollToFirstRowOnChange: true, y: 341 },
          },
        }}
        pagination={{
          hasPagination: true,
          current: currentPage,
          onChange: (page) => setCurrentPage(+page),
          total: DATA_LENGTH,
          pageSize: PAGE_SIZE,
          showTotal: (total) => `Tổng cẩm nang: ${total}`,
        }}
        filterMenu={{
          hasFilterMenu: true,
          menu: [
            {
              title: "Chọn vai trò",
              icon: <MdPublishedWithChanges />,
              menuItems: status,
              selectedKey: selectedStatus,
              setSelectedKey: (value) => setSelectedStatus(value),
            },
          ],
        }}
        search={{
          hasSearchInput: true,
          value: searchKeyWords,
          setValue: setSearchKeyWords,
          placeholder: "Tìm kiếm theo Tiêu đề cẩm nang hoặc Tác giả",
          width: 400,
          onSubmit: () => console.log(searchKeyWords),
        }}
        reset={{ hasResetButton: true, onClick: handleReset }}
        crudButton={{
          hasCRUDButton: true,
          buttonsMenu: [
            {
              title: "Thêm cẩm nang",
              icon: <HiPlusCircle />,
              onClick: () => console.log("Thêm cẩm nang mới"),
            },
          ],
        }}
        actions={{
          hasActions: true,
          actionsMenu: [
            {
              title: "Xem nội dung cẩm nang",
              icon: <FiEye className="text-blue-600" />,
              onClick: (data) => console.log("Xem ", data),
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
            {
              title: "Đăng/Gỡ cẩm nang",
              render: (data) => (
                <Tooltip
                  title={
                    data?.isPublished === true ? "Gỡ cẩm nang" : "Đăng cẩm nang"
                  }
                >
                  <Switch
                    size="small"
                    // checked={data?.isPublished ?? false}
                    defaultChecked={data?.isPublished ?? false}
                    onChange={(checked) =>
                      console.log("Gỡ/Đăng ", checked, data)
                    }
                  />
                </Tooltip>
              ),
            },
          ],
          widthColumn: 150,
        }}
      />
    </ManagementContentLayout>
  );
};

export default PicnicGuide;
