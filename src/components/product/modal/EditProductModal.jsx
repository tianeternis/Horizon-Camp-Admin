import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createNewProduct, getProductByID } from "@/services/productService";
import EditProductForm from "../form/EditProductForm";

const FORM_NAME = "edit-product-form";

const EditProductModal = ({
  open = false,
  handleClose = () => {},
  productID = null,
  refetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (productID) {
      const fetchProduct = async () => {
        const res = await getProductByID(productID);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setProduct(res.DT);
        }
      };

      fetchProduct();
    }
  }, [productID]);

  const handleSave = async (data) => {
    console.log(data);

    // if (data) {
    //   setLoading(true);
    //   const res = await createNewProduct(data);
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
      title="Chỉnh sửa sản phẩm"
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
      <EditProductForm
        name={FORM_NAME}
        handleSave={handleSave}
        initialValues={product}
      />
    </Modal>
  );
};

export default EditProductModal;
