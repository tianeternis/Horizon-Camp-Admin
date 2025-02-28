import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserForm from "../form/UserForm";
import { editUser, getUserByID } from "@/services/userService";

const FORM_NAME = "edit-user-form";

const EditUserModal = ({
  open = false,
  handleClose = () => {},
  userID,
  refetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userID) {
      const fetchUser = async () => {
        const res = await getUserByID(userID);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setUser(res.DT);
        }
      };

      fetchUser();
    }
  }, [userID]);

  const handleSave = async (data) => {
    if (data && user?._id) {
      setLoading(true);

      delete data?.email;
      const res = await editUser(user?._id, {
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
      title="Chỉnh sửa nhân viên"
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
      <UserForm
        name={FORM_NAME}
        handleSave={handleSave}
        edit={{ editable: true, initialValue: user }}
      />
    </Modal>
  );
};

export default EditUserModal;
