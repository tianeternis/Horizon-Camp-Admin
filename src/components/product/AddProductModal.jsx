import { createNewCategory } from "@/services/categoryService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";

const FORM_NAME = "add-product-form";

const AddProductModal = ({
  open = false,
  handleClose = () => {},
  refetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    console.log(data);

    // if (data) {
    //   setLoading(true);
    //   const res = await createNewCategory(data);
    //   setLoading(false);
    //   if (res && res.EC === StatusCodes.SUCCESS) {
    //     toast.success(res.EM);
    //     handleClose();
    //     refetch();
    //   }
    //   if (res && res.EC === StatusCodes.ERRROR) {
    //     toast.error(res.EM);
    //   }
    // }
  };

  return (
    <Modal
      title="Thêm sản phẩm"
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="Thoát"
      okText="Lưu"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        form: FORM_NAME,
        loading: loading,
        disabled: loading,
      }}
      cancelButtonProps={{
        loading: loading,
        disabled: loading,
      }}
      width={1200}
      style={{ top: 20 }}
    >
      <ProductForm name={FORM_NAME} handleSave={handleSave} />
    </Modal>
  );
};

export default AddProductModal;
