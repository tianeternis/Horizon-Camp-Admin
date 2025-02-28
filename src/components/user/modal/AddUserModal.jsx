import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import UserForm from "../form/UserForm";
import { addUser } from "@/services/userService";

const FORM_NAME = "add-user-form";

const AddUserModal = ({
  open = false,
  handleClose = () => {},
  refetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    if (data) {
      setLoading(true);
      const res = await addUser({
        ...data,
        birthday: new Date(data?.birthday).toISOString(),
      });

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        handleClose();
        refetch();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }

      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm nhân viên"
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
      centered={true}
    >
      <UserForm name={FORM_NAME} handleSave={handleSave} />
    </Modal>
  );
};

export default AddUserModal;
