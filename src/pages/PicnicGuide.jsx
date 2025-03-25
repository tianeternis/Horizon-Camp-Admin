import { useDynamicTitle } from "@/hooks";
import ManagementContentLayout from "@/layouts/ManagementContentLayout";
import ManagementDataTable from "@/components/table/ManagementDataTable";
import Avatar from "@/components/avatar/Avatar";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import { Image, Switch, Tag, Tooltip } from "antd";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { MdPublishedWithChanges } from "react-icons/md";
import { HiPlusCircle } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import AddPicnicGuideModal from "@/components/picnicGuide/AddPicnicGuideModal";
import {
  changePublisedStatus,
  deleteGuide,
  getPicnicGuides,
} from "@/services/guideService";
import StatusCodes from "@/utils/status/StatusCodes";
import { toast } from "react-toastify";
import { PAGE_SIZE } from "@/constants";
import ConfirmModal from "@/components/modal/ConfirmModal";
import EditPicnicGuideModal from "@/components/picnicGuide/EditPicnicGuideModal";
import ViewPicnicGuideModal from "@/components/picnicGuide/ViewPicnicGuideModal";

const statuses = [
  { key: "default", label: "Tất cả trạng thái" },
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
        <span className="font-semibold">{record?.author?.fullName}</span>
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
    align: "center",
    render: (createdAt) => formatDateToHHMMDDMMYYYY(createdAt),
  },
  {
    key: "status",
    title: "Trạng thái",
    dataIndex: "status",
    width: 100,
    align: "center",
    render: (_, record) => (
      <Tag color={record?.isPublished ? "green" : "gold"}>
        <span className="uppercase">
          {record?.isPublished ? "Đã đăng" : "Đã gỡ"}
        </span>
      </Tag>
    ),
  },
  {
    key: "publishedAt",
    title: "Ngày đăng cuối cùng",
    dataIndex: "publishedAt",
    width: 140,
    align: "center",
    render: (publishedAt) =>
      publishedAt ? formatDateToHHMMDDMMYYYY(publishedAt) : "--",
  },
  {
    key: "updatedAt",
    title: "Ngày cập nhật cuối cùng",
    dataIndex: "updatedAt",
    width: 140,
    align: "center",
    render: (updatedAt) =>
      updatedAt ? formatDateToHHMMDDMMYYYY(updatedAt) : "--",
  },
];

const sorts = [
  { key: "newest", label: "Được tạo mới nhất" },
  { key: "oldest", label: "Được tạo lâu nhất" },
];

const DEFAULT_STATUS = statuses[0];
const DEFAULT_SORT = sorts[0];

const PicnicGuide = ({}) => {
  useDynamicTitle("Cẩm nang dã ngoại");

  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_STATUS);
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    data: null,
    loading: false,
  });
  const [editModal, setEditModal] = useState({
    show: false,
    data: null,
  });
  const [viewModal, setViewModal] = useState({
    show: false,
    data: null,
  });

  const fetchGuides = async (status, search, sort, page, limit) => {
    setLoading(true);

    const res = await getPicnicGuides({ status, search, sort, page, limit });

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
    fetchGuides(
      selectedStatus?.key,
      searchKeyWords,
      sort?.key,
      currentPage,
      PAGE_SIZE,
    );
  }, []);

  const handleSelectStatus = async (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    await fetchGuides(status?.key, searchKeyWords, sort?.key, 1, PAGE_SIZE);
  };

  const handleSelectSort = async (value) => {
    setSort(value);
    setCurrentPage(1);
    await fetchGuides(
      selectedStatus?.key,
      searchKeyWords,
      value?.key,
      1,
      PAGE_SIZE,
    );
  };

  const handleChangePage = async (page) => {
    setCurrentPage(page);
    await fetchGuides(
      selectedStatus?.key,
      searchKeyWords,
      sort?.key,
      page,
      PAGE_SIZE,
    );
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchGuides(
      selectedStatus?.key,
      searchKeyWords,
      sort?.key,
      1,
      PAGE_SIZE,
    );
  };

  const handleReset = async () => {
    setCurrentPage(1);
    setSelectedStatus(DEFAULT_STATUS);
    setSearchKeyWords("");
    setSort(DEFAULT_SORT);
    await fetchGuides(DEFAULT_STATUS?.key, "", DEFAULT_SORT?.key, 1, PAGE_SIZE);
  };

  const changeIsPublished = async (guide, checked) => {
    const res = await changePublisedStatus(guide?._id, checked);

    if (res && res.EC === StatusCodes.SUCCESS) {
      toast.success(res.EM);
      await fetchGuides(
        selectedStatus?.key,
        searchKeyWords,
        sort?.key,
        currentPage,
        PAGE_SIZE,
      );
    }

    if (res && res.EC === StatusCodes.ERRROR) {
      toast.error(res.EM);
    }
  };

  const handleDeleteGuide = async () => {
    if (deleteModal.data?._id) {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await deleteGuide(deleteModal.data?._id);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        setDeleteModal((prev) => ({ ...prev, show: false, data: null }));
        await handleReset();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div>
      <ManagementContentLayout title="Cẩm nang dã ngoại">
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
            showTotal: (total) => `Tổng cẩm nang: ${total}`,
          }}
          filterMenu={{
            hasFilterMenu: true,
            menu: [
              {
                title: "Chọn trạng thái",
                icon: <MdPublishedWithChanges />,
                menuItems: statuses,
                selectedKey: selectedStatus,
                setSelectedKey: (value) => handleSelectStatus(value),
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
            placeholder: "Tìm kiếm theo Tiêu đề cẩm nang",
            width: 400,
            onSubmit: () => handleSearch(),
          }}
          reset={{ hasResetButton: true, onClick: handleReset }}
          crudButton={{
            hasCRUDButton: true,
            buttonsMenu: [
              {
                title: "Thêm cẩm nang",
                icon: <HiPlusCircle />,
                onClick: () => setShowAddModal(true),
              },
            ],
          }}
          actions={{
            hasActions: true,
            actionsMenu: [
              {
                title: "Xem nội dung cẩm nang",
                icon: <FiEye className="text-blue-600" />,
                onClick: (data) => setViewModal({ show: true, data }),
              },
              {
                title: "Chỉnh sửa",
                icon: <BiEditAlt className="text-green-600" />,
                onClick: (data) => setEditModal({ show: true, data }),
              },
              {
                title: "Xóa",
                icon: <BiTrash className="text-red-600" />,
                onClick: (data) =>
                  setDeleteModal((prev) => ({ ...prev, show: true, data })),
              },
              {
                title: "Đăng/Gỡ cẩm nang",
                render: (data) => (
                  <Tooltip
                    title={
                      data?.isPublished === true
                        ? "Gỡ cẩm nang"
                        : "Đăng cẩm nang"
                    }
                  >
                    <Switch
                      size="small"
                      defaultChecked={data?.isPublished ?? false}
                      onChange={(checked) => changeIsPublished(data, checked)}
                    />
                  </Tooltip>
                ),
              },
            ],
            widthColumn: 150,
          }}
        />
      </ManagementContentLayout>
      {showAddModal && (
        <AddPicnicGuideModal
          open={showAddModal}
          handleClose={() => setShowAddModal(false)}
          refetch={handleReset}
        />
      )}
      {deleteModal.show && deleteModal.data && (
        <ConfirmModal
          open={deleteModal.show}
          handleClose={() =>
            setDeleteModal({ show: false, data: null, loading: false })
          }
          content={`Bạn có chắc muốn xóa cẩm nang với mã #${deleteModal.data?._id} hay không?`}
          handleOK={handleDeleteGuide}
          loading={deleteModal.loading}
        />
      )}
      {editModal.show && editModal.data && (
        <EditPicnicGuideModal
          open={editModal.show}
          handleClose={() => setEditModal({ show: false, data: null })}
          initialValues={editModal.data}
          refetch={async () =>
            await fetchGuides(
              selectedStatus?.key,
              searchKeyWords,
              sort?.key,
              currentPage,
              PAGE_SIZE,
            )
          }
        />
      )}
      {viewModal.show && viewModal.data && (
        <ViewPicnicGuideModal
          open={viewModal.show}
          handleClose={() => setViewModal({ show: false, data: null })}
          guideSlug={viewModal.data?.slug}
        />
      )}
    </div>
  );
};

export default PicnicGuide;
