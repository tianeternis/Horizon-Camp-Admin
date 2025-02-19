import { getProductByID } from "@/services/productService";
import { formatCurrency } from "@/utils/format/currency";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import StatusCodes from "@/utils/status/StatusCodes";
import { Collapse, Image, Modal, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";

const ViewDiscountModal = ({
  open = false,
  handleClose = () => {},
  productID = null,
}) => {
  return (
    <Modal
      title="Xem thông tin chiết khấu"
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="Thoát"
      okButtonProps={{ hidden: true }}
      width={800}
      style={{ top: 20 }}
    ></Modal>
  );
};

export default ViewDiscountModal;
