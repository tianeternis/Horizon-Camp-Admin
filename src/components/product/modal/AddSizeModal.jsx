import { createNewSize } from "@/services/variantService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Form, Input, Modal } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

const FORM_NAME = "add-size-form";

const INPUT_NAME = {
  NAME: "name",
};

const AddSizeModal = ({
  open = false,
  handleClose = () => {},
  refetch = () => {},
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await createNewSize(values);
    setLoading(false);

    if (res && res.EC === StatusCodes.SUCCESS) {
      toast.success(res.EM);
      handleClose();
      refetch();
    }

    if (res && res.EC === StatusCodes.ERRROR) {
      toast.error(res.EM);
    }
  };

  return (
    <Modal
      centered
      title="Thêm kích thước"
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
      <Form
        form={form}
        name={FORM_NAME}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        clearOnDestroy
      >
        <Form.Item
          name={INPUT_NAME.NAME}
          label="Tên kích thước"
          rules={[{ required: true, message: "Vui lòng nhập tên kích thước!" }]}
        >
          <Input onBlur={() => form.validateFields([INPUT_NAME.NAME])} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSizeModal;
