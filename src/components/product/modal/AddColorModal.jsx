import { createNewColor } from "@/services/variantService";
import StatusCodes from "@/utils/status/StatusCodes";
import { ColorPicker, Form, Input, Modal } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

const FORM_NAME = "add-color-form";

const INPUT_NAME = {
  NAME: "name",
  HEX: "hex",
};

const AddColorModal = ({
  open = false,
  handleClose = () => {},
  refetch = () => {},
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await createNewColor(values);
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
      title="Thêm màu sắc"
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
          label="Tên màu sắc"
          rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]}
        >
          <Input onBlur={() => form.validateFields([INPUT_NAME.NAME])} />
        </Form.Item>
        <Form.Item
          name={INPUT_NAME.HEX}
          label="Màu sắc"
          rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}
        >
          <ColorPicker
            allowClear
            showText={(color) => <span>Mã hex: {color.toHexString()}</span>}
            onChange={(value) =>
              form.setFieldsValue({ [INPUT_NAME.HEX]: value.toHexString() })
            }
            style={{ width: "100%", display: "flex", justifyContent: "start" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddColorModal;
