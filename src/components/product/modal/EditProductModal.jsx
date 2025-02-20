import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createNewProduct,
  editProduct,
  getProductByID,
} from "@/services/productService";
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
    if (data && productID) {
      const { variants, attributes } = data;

      if (attributes && attributes?.length > 0) {
        let addedAttributes = [];
        let removedAttributes = [];
        let editedAttributes = [];

        attributes?.forEach((item, i) => {
          if (item?.add) {
            addedAttributes.push(item);
          } else if (item?.delete) {
            removedAttributes.push(item);
          } else {
            const defaultAttribute = product?.attributes?.find(
              (a) => a?._id === item?._id,
            );

            if (
              defaultAttribute?.name !== item?.name ||
              defaultAttribute?.value !== item?.value
            ) {
              editedAttributes.push(item);
            }
          }
        });

        data.attributes = {
          add: addedAttributes,
          remove: removedAttributes,
          edit: editedAttributes,
        };
      }

      if (variants && variants?.length > 0) {
        const addedVariants = [];
        const removedVariants = [];
        const editedVariants = [];

        variants?.forEach((item, i) => {
          if (item?.add) {
            addedVariants.push(item);
          } else if (item?.delete) {
            removedVariants.push(item);
          } else {
            const defaultVariant = product?.variants?.find(
              (a) => a?._id === item?._id,
            );

            if (
              defaultVariant?.quantity !== item?.quantity ||
              defaultVariant?.price !== item?.price ||
              defaultVariant?.color?._id !== item?.colorID ||
              defaultVariant?.size?._id !== item?.sizeID
            ) {
              editedVariants.push(item);
            }
          }
        });

        data.variants = {
          add: addedVariants,
          remove: removedVariants,
          edit: editedVariants,
        };
      }

      setLoading(true);
      const res = await editProduct(productID, data);
      setLoading(false);

      console.log(res);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        handleClose();
        refetch();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
    }
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
