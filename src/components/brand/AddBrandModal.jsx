import { Modal } from "antd";
import BrandForm from "./BrandForm";

const FORM_NAME = "add-brand-form";

const AddBrandModal = ({ open = false, handleClose = () => {} }) => {
  return (
    <Modal
      title="Thêm thương hiệu"
      open={open}
      //   onOk={handleOk}
      onCancel={handleClose}
      //   confirmLoading={confirmLoading}
      maskClosable={false}
      cancelText="Thoát"
      okText="Lưu"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        form: FORM_NAME,
      }}
    >
      <BrandForm name={FORM_NAME} />
    </Modal>
  );
};

export default AddBrandModal;
