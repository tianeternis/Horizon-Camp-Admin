import { getOrderByID } from "@/services/orderService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useEffect, useState } from "react";

const ViewOrderDetailModal = ({
  open = false,
  handleClose = () => {},
  orderID = null,
}) => {
  const [order, setOrder] = useState();

  console.log(order);

  useEffect(() => {
    if (orderID) {
      const fetchOrder = async () => {
        const res = await getOrderByID(orderID);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setOrder(res.DT);
        }
      };

      fetchOrder();
    }
  }, [orderID]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="Thoát"
      okButtonProps={{ hidden: true }}
      width={1000}
      style={{ top: 20 }}
    >
      <div>hihi</div>
    </Modal>
  );
};

export default ViewOrderDetailModal;
