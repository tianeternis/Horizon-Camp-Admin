import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import StatusCodes from "@/utils/status/StatusCodes";
import { Collapse, Empty, Modal, Table, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  deleteDiscount,
  getDiscountsByProductID,
} from "@/services/discountService";
import { RiEdit2Fill } from "react-icons/ri";
import { BiSolidTrashAlt } from "react-icons/bi";
import EditFutureDiscountModal from "./EditFutureDiscountModal";
import ConfirmModal from "@/components/modal/ConfirmModal";
import EditCurrentDiscountModal from "./EditCurrentDiscountModal";
import AddDiscountModal from "./AddDiscountModal";
import { toast } from "react-toastify";

const ViewDiscountModal = ({
  open = false,
  handleClose = () => {},
  productID = null,
}) => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [editFutureModal, setEditFutureModal] = useState({
    show: false,
    data: null,
  });
  const [editCurrentModal, setEditCurrentModal] = useState({
    show: false,
    data: null,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeletModal] = useState({ show: false, data: null });

  const fetchData = async (productID) => {
    setLoading(true);
    const res = await getDiscountsByProductID(productID);

    if (res && res.EC === StatusCodes.SUCCESS) {
      setData(res.DT);
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (productID) {
      fetchData(productID);
    }
  }, [productID]);

  const handleDeleteDiscount = async () => {
    if (deleteModal.data && deleteModal.data?._id) {
      const res = await deleteDiscount(deleteModal?.data?._id);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        setDeletModal({ show: false, data: null });
        fetchData(productID);
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
    }
  };

  return (
    <Modal
      title={`Xem thông tin chiết khấu ${data?.product?.name}`}
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="Thoát"
      okButtonProps={{ hidden: true }}
      width={800}
      loading={loading}
      style={{ top: 40 }}
    >
      <div>
        <div className="space-y-4 py-3">
          <div className="flex justify-between">
            <div
              className="flex gap-2"
              style={data?.discount?.current ? { flexDirection: "column" } : {}}
            >
              <div className="font-semibold">Giảm giá đang được áp dụng:</div>
              {data?.discount?.current ? (
                <ul className="ms-6 space-y-1.5">
                  <li className="space-x-2">
                    <span className="font-medium">Giá trị:</span>
                    <span>{data?.discount?.current?.value}%</span>
                  </li>
                  <li className="space-x-2">
                    <span className="font-medium">Ngày bắt đầu:</span>
                    <span>
                      {formatDateToHHMMDDMMYYYY(
                        data?.discount?.current?.startDate,
                      )}
                    </span>
                  </li>
                  <li className="space-x-2">
                    <span className="font-medium">Ngày kết thúc:</span>
                    <span>
                      {formatDateToHHMMDDMMYYYY(
                        data?.discount?.current?.endDate,
                      )}
                    </span>
                  </li>
                </ul>
              ) : (
                <Tag color="blue">Không có</Tag>
              )}
            </div>
            <div className="flex items-start justify-center gap-2.5">
              {data?.discount?.current && (
                <button
                  className="block text-blue-600"
                  onClick={() =>
                    setEditCurrentModal({
                      show: true,
                      data: data?.discount?.current,
                    })
                  }
                >
                  Cập nhật
                </button>
              )}
              <button
                className="block text-main"
                onClick={() => setShowAddModal(true)}
              >
                Thêm mới
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">Giảm giá đang chờ áp dụng:</div>
            <div>
              <Table
                size="small"
                bordered
                columns={[
                  {
                    key: "STT",
                    dataIndex: "STT",
                    title: "STT",
                    align: "center",
                    render: (_, __, index) => index + 1,
                  },
                  {
                    key: "value",
                    dataIndex: "value",
                    title: "Giá trị",
                    align: "center",
                    render: (value) => `${value}%`,
                  },
                  {
                    key: "startDate",
                    dataIndex: "startDate",
                    title: "Ngày bắt đầu",
                    align: "center",
                    render: (value) => (
                      <span>{formatDateToHHMMDDMMYYYY(value)}</span>
                    ),
                  },
                  {
                    key: "endDate",
                    dataIndex: "endDate",
                    title: "Ngày kết thúc",
                    align: "center",
                    render: (value) => (
                      <span>{formatDateToHHMMDDMMYYYY(value)}</span>
                    ),
                  },
                  {
                    key: "actions",
                    dataIndex: "actions",
                    title: "Hành động",
                    align: "center",
                    render: (_, record) => (
                      <div className="flex items-center justify-center gap-3">
                        <Tooltip title="Chỉnh sửa giảm giá">
                          <button
                            className="text-base text-green-600"
                            onClick={() =>
                              setEditFutureModal({ show: true, data: record })
                            }
                          >
                            <RiEdit2Fill />
                          </button>
                        </Tooltip>
                        <Tooltip title="Xóa giảm giá">
                          <button
                            className="text-base text-red-600"
                            onClick={() =>
                              setDeletModal({ show: true, data: record })
                            }
                          >
                            <BiSolidTrashAlt />
                          </button>
                        </Tooltip>
                      </div>
                    ),
                  },
                ]}
                dataSource={
                  data?.discount?.future && data?.discount?.future?.length > 0
                    ? data?.discount?.future?.map((item) => ({
                        key: item?._id,
                        ...item,
                      }))
                    : []
                }
                pagination={false}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Không có dữ liệu"
                    />
                  ),
                }}
              />
            </div>
          </div>
          <div className="pt-4">
            <Collapse
              items={[
                {
                  key: "passDiscount",
                  label: "Lịch sử giảm giá",
                  children: (
                    <Table
                      size="small"
                      bordered
                      columns={[
                        {
                          key: "STT",
                          dataIndex: "STT",
                          title: "STT",
                          align: "center",
                          render: (_, __, index) => index + 1,
                        },
                        {
                          key: "value",
                          dataIndex: "value",
                          title: "Giá trị",
                          align: "center",
                          render: (value) => `${value}%`,
                        },
                        {
                          key: "startDate",
                          dataIndex: "startDate",
                          title: "Ngày bắt đầu",
                          align: "center",
                          render: (value) => (
                            <span>{formatDateToHHMMDDMMYYYY(value)}</span>
                          ),
                        },
                        {
                          key: "endDate",
                          dataIndex: "endDate",
                          title: "Ngày kết thúc",
                          align: "center",
                          render: (value) => (
                            <span>{formatDateToHHMMDDMMYYYY(value)}</span>
                          ),
                        },
                      ]}
                      dataSource={
                        data?.discount?.pass && data?.discount?.pass?.length > 0
                          ? data?.discount?.pass?.map((item) => ({
                              key: item?._id,
                              ...item,
                            }))
                          : []
                      }
                      pagination={false}
                      locale={{
                        emptyText: (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có dữ liệu"
                          />
                        ),
                      }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
        {editFutureModal.show && (
          <EditFutureDiscountModal
            open={editFutureModal.show}
            handleClose={() => setEditFutureModal({ show: false, data: null })}
            discount={editFutureModal.data}
            productID={productID}
            refetch={fetchData}
          />
        )}
        {editCurrentModal.show && (
          <EditCurrentDiscountModal
            open={editCurrentModal.show}
            handleClose={() => setEditCurrentModal({ show: false, data: null })}
            discount={editCurrentModal.data}
            productID={productID}
            refetch={fetchData}
          />
        )}
        {showAddModal && (
          <AddDiscountModal
            open={showAddModal}
            handleClose={() => setShowAddModal(false)}
            productID={productID}
            refetch={fetchData}
          />
        )}
        {deleteModal.show && (
          <ConfirmModal
            open={deleteModal.show}
            handleClose={() => setDeletModal({ show: false, data: null })}
            content={"Bạn có chắc chắn muốn xóa giảm giá này không?"}
            handleOK={handleDeleteDiscount}
          />
        )}
      </div>
    </Modal>
  );
};

export default ViewDiscountModal;
