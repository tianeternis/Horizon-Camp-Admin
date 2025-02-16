import { createNewBrand } from "@/services/brandService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useState } from "react";
import BrandForm from "./BrandForm";
import { toast } from "react-toastify";

const FORM_NAME = "add-brand-form";

const AddBrandModal = ({
  open = false,
  handleClose = () => {},
  refetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    if (data) {
      setLoading(true);
      const res = await createNewBrand(data);
      setLoading(false);

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
      title="Thêm thương hiệu"
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
    >
      <BrandForm name={FORM_NAME} handleSave={handleSave} />
    </Modal>
  );
};

export default AddBrandModal;
