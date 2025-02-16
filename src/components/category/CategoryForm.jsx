import "@/assets/css/scrollbar.css";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import SingleUpload from "../upload/SingleUpload";

const INPUT_NAME = {
  NAME: "name",
  DESCRIPTION: "description",
  IMAGE: "image",
};

const CategoryForm = ({
  name = "",
  handleSave = (data) => {},
  edit = { editable: false, initialValue: null },
}) => {
  const [form] = Form.useForm();

  const [initialImages, setInitialImages] = useState([]);

  useEffect(() => {
    if (edit && edit.editable && edit.initialValue) {
      const values = edit?.initialValue;
      form.setFieldsValue({
        [INPUT_NAME.NAME]: values?.name,
        [INPUT_NAME.DESCRIPTION]: values?.description,
        [INPUT_NAME.IMAGE]: values?.image,
      });
      setInitialImages([
        {
          uid: "-1",
          name: `${values?.name}.png`,
          status: "done",
          url: values?.image,
        },
      ]);
    }
  }, [edit.initialValue]);

  const onFinish = (values) => {
    handleSave(values);
  };

  return (
    <Form
      form={form}
      name={name}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      clearOnDestroy
    >
      <Form.Item
        name={INPUT_NAME.NAME}
        label="Tên danh mục"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
      >
        <Input onBlur={() => form.validateFields([INPUT_NAME.NAME])} />
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.DESCRIPTION}
        label="Mô tả danh mục"
        rules={[{ required: true, message: "Vui lòng nhập mô tả danh mục!" }]}
      >
        <Input.TextArea
          rows={4}
          spellCheck={false}
          onBlur={() => form.validateFields([INPUT_NAME.DESCRIPTION])}
          className="custom-scrollbar"
        />
      </Form.Item>
      <Form.Item>
        <SingleUpload
          label="Hình ảnh"
          name={INPUT_NAME.IMAGE}
          form={form}
          rules={[
            {
              required: true,
              message: "Vui lòng tải lên hình ảnh danh mục!",
            },
          ]}
          initialImages={initialImages}
        >
          <Button icon={<UploadOutlined />}>Tải hình ảnh lên</Button>
        </SingleUpload>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
