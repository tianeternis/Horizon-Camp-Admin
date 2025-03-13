import {
  acceptOrder,
  cancelOrder,
  completeOrder,
  completePreparingOrder,
  getOrderByID,
} from "@/services/orderService";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import StatusCodes from "@/utils/status/StatusCodes";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import StatusTag from "../status/StatusTag";
import { HiOutlineInformationCircle, HiOutlineMapPin } from "react-icons/hi2";
import { PiNotepad } from "react-icons/pi";
import { formatAddress } from "@/utils/format/address";
import { formatCurrency } from "@/utils/format/currency";
import { ORDER_STATUS } from "@/utils/order";
import { toast } from "react-toastify";
import Invoice from "@/components/invoice/Invoice";

const ViewOrderDetailModal = ({
  open = false,
  handleClose = () => {},
  orderID = null,
  refetch = () => {},
}) => {
  const [order, setOrder] = useState();

  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async (orderID) => {
    const res = await getOrderByID(orderID);

    if (res && res.EC === StatusCodes.SUCCESS) {
      setOrder(res.DT);
    }
  };

  useEffect(() => {
    if (orderID) {
      fetchOrder(orderID);
    }
  }, [orderID]);

  const handleAccept = async () => {
    if (orderID) {
      setActionLoading(true);
      const res = await acceptOrder(orderID);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        await fetchOrder(orderID);
        refetch();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (orderID) {
      setActionLoading(true);
      const res = await cancelOrder(orderID);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        await fetchOrder(orderID);
        refetch();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
      setActionLoading(false);
    }
  };

  const handleCompletePreparing = async () => {
    if (orderID) {
      setActionLoading(true);
      const res = await completePreparingOrder(orderID);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        await fetchOrder(orderID);
        refetch();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
      setActionLoading(false);
    }
  };

  const handleCompleteDelivering = async () => {
    if (orderID) {
      setActionLoading(true);
      const res = await completeOrder(orderID);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        await fetchOrder(orderID);
        refetch();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
      setActionLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Chi tiết đơn hàng"
      maskClosable={false}
      footer={[
        <Button
          key="back"
          onClick={handleClose}
          loading={actionLoading}
          disabled={actionLoading}
        >
          Thoát
        </Button>,
        ...(order?.orderStatus === ORDER_STATUS.PENDING
          ? [
              <Button
                key="cancel"
                color="danger"
                variant="solid"
                onClick={handleCancel}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Hủy đơn
              </Button>,
              <Button
                key="accept"
                type="primary"
                onClick={handleAccept}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Duyệt đơn hàng
              </Button>,
            ]
          : []),
        ...(order?.orderStatus === ORDER_STATUS.PREPARING
          ? [
              <Button
                key="prepared"
                type="primary"
                onClick={handleCompletePreparing}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Hoàn thành chuẩn bị
              </Button>,
            ]
          : []),
        ...(order?.orderStatus === ORDER_STATUS.DELIVERING
          ? [
              <Button
                key="deliveried"
                type="primary"
                onClick={handleCompleteDelivering}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Hoàn thành giao hàng
              </Button>,
            ]
          : []),
        ...(order?.orderStatus === ORDER_STATUS.COMPLETED
          ? [<Invoice key="invoice" order={order} />]
          : []),
      ]}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="divide-y divide-solid divide-gray-200">
        <div className="flex items-center justify-between pb-4 pt-2">
          <div className="space-y-1">
            <div className="text-lg font-bold">
              <span>Mã đơn hàng </span>
              <span className="text-main">#{order?._id}</span>
            </div>
            <div className="text-sm text-neutral-500">
              <span>Ngày đặt: </span>
              <span className="text-gray-800">
                {formatDateToHHMMDDMMYYYY(order?.orderDate)}
              </span>
            </div>
            {order?.cancelDate && (
              <div className="text-sm text-neutral-500">
                <span>Ngày hủy: </span>
                <span className="text-gray-800">
                  {formatDateToHHMMDDMMYYYY(order?.cancelDate)}
                </span>
              </div>
            )}
            {order?.deliveryDate && (
              <div className="text-sm text-neutral-500">
                <span>Ngày giao: </span>
                <span className="text-gray-800">
                  {formatDateToHHMMDDMMYYYY(order?.deliveryDate)}
                </span>
              </div>
            )}
          </div>
          <div className="w-fit">
            <StatusTag status={order?.orderStatus} />
          </div>
        </div>
        <div className="py-4">
          <div className="flex divide-x divide-solid divide-gray-200">
            <div className="w-1/2 space-y-4 pr-6">
              <div className="text-15px text-neutral-600">
                Thông tin giao hàng
              </div>
              <div className="flex items-center">
                <HiOutlineInformationCircle className="mr-2 text-xl text-orange-400" />
                <div>
                  <p className="text-sm font-medium">
                    {order?.address?.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order?.address?.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <HiOutlineMapPin className="mr-2 text-xl text-orange-400" />
                <div className="text-sm text-gray-600">
                  {formatAddress({
                    details: order?.address?.detailAddress,
                    province: order?.address?.provinceName,
                    district: order?.address?.districtName,
                    ward: order?.address?.wardName,
                  })}
                </div>
              </div>
              <div className="flex items-center">
                <PiNotepad className="mr-2 text-xl text-orange-400" />
                <div className="text-sm text-gray-600">{order?.notes}</div>
              </div>
            </div>
            <div className="w-1/2 space-y-4 pl-6">
              <div className="flex items-start justify-between gap-2">
                <div className="text-15px text-neutral-600">
                  Thông tin tà khoản
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold">{order?.user?.fullName}</div>
                  <div className="text-gray-600">{order?.user?.email}</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-15px text-neutral-600">
                  Phương thức thanh toán
                </div>
                <div className="text-sm font-semibold">
                  {order?.paymentMethod}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-15px text-neutral-600">
                  Trạng thái thanh toán
                </div>
                <div className="text-sm font-semibold">
                  {order?.paymentStatus}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 py-4">
          <div className="text-base font-bold">Thông tin sản phẩm</div>
          <div className="divide-y divide-solid divide-gray-200">
            <div className="py-2">
              {order?.orderDetails &&
                order?.orderDetails?.length > 0 &&
                order?.orderDetails?.map((detail, i) => (
                  <div
                    key={`order-detail-product-${i}-${detail?._id}`}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-sm">
                        <img
                          src={detail?.image}
                          alt="..."
                          className="h-16 w-16"
                        />
                      </div>
                      <div className="">
                        <div className="text-15px font-semibold">
                          {detail?.name}
                        </div>
                        {(detail?.color || detail?.size) && (
                          <div>
                            {(() => {
                              const variant = [];
                              if (detail?.color) variant.push(detail?.color);
                              if (detail?.size) variant.push(detail?.size);

                              return variant.join(", ");
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-15px font-semibold text-main">
                        {formatCurrency(detail?.discountedPrice)}
                      </div>
                      <div className="text-sm text-gray-500">
                        x{detail?.quantity}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-800">Tạm tính</div>
                <div className="text-sm font-medium">
                  {formatCurrency(order?.totalPrice)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-800">Phí vận chuyển</div>
                <div className="text-sm font-medium">
                  {formatCurrency(order?.shippingFee)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-800">Tổng thanh toán</div>
                <div className="text-xl font-bold text-main">
                  {formatCurrency(order?.orderTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewOrderDetailModal;
