import StatusCodes from "@/utils/status/StatusCodes";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import SingleUpload from "../upload/SingleUpload";
import { UploadOutlined } from "@ant-design/icons";
import Editor from "../editor/Editor";
import { createNewPicnicGuide } from "@/services/guideService";
import { useSelector } from "react-redux";

const FORM_NAME = "add-picnic-guide-form";

const INPUT_NAME = {
  TITLE: "title",
  SUMMARY: "summary",
  IMAGE: "image",
  CONTENT: "content",
};

const AddPicnicGuideModal = ({
  open = false,
  handleClose = () => {},
  refetch = () => {},
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleChangeContent = (newContent) => {
    const value = newContent?.trim() === "<p><br></p>" ? "" : newContent;
    setContent(value);
    form.setFieldsValue({ [INPUT_NAME.CONTENT]: value });
  };

  const user = useSelector((state) => state?.user?.account);
  const onFinish = async (data) => {
    if (data && user?._id) {
      setLoading(true);

      const res = await createNewPicnicGuide({ userID: user?._id, ...data });

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
      title="Thêm cẩm nang dã ngoại"
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
      width={900}
      style={{ top: 20 }}
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
          name={INPUT_NAME.TITLE}
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input onBlur={() => form.validateFields([INPUT_NAME.TITLE])} />
        </Form.Item>
        <div className="flex gap-6">
          <div className="w-1/2">
            <Form.Item
              name={INPUT_NAME.SUMMARY}
              label="Tóm tắt"
              rules={[{ required: true, message: "Vui lòng nhập tóm tắt!" }]}
            >
              <Input.TextArea
                rows={4}
                spellCheck={false}
                onBlur={() => form.validateFields([INPUT_NAME.SUMMARY])}
              />
            </Form.Item>
          </div>
          <div className="w-1/2">
            <Form.Item noStyle>
              <SingleUpload
                label="Hình ảnh"
                name={INPUT_NAME.IMAGE}
                form={form}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải lên hình ảnh cẩm nang!",
                  },
                ]}
              >
                <Button icon={<UploadOutlined />}>Tải hình ảnh lên</Button>
              </SingleUpload>
            </Form.Item>
          </div>
        </div>
        <Form.Item
          name={INPUT_NAME.CONTENT}
          label="Nội dung"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập nội dung của cẩm nang!",
            },
          ]}
        >
          <Editor content={content} setContent={handleChangeContent} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPicnicGuideModal;
