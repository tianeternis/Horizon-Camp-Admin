import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import { useState } from "react";

const INPUT_NAME = {
  NAME: "name",
  DESCRIPTION: "description",
  IMAGE: "image",
};

const BrandForm = ({ name = "" }) => {
  const [form] = Form.useForm();

  const [images, setImages] = useState([]);

  const onFinish = async (values) => {
    console.log(values);
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
        label="Tên thương hiệu"
        rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu!" }]}
      >
        <Input onBlur={() => form.validateFields([INPUT_NAME.NAME])} />
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.DESCRIPTION}
        label="Mô tả thương hiệu"
        rules={[
          { required: true, message: "Vui lòng nhập mô tả thương hiệu!" },
        ]}
      >
        <Input.TextArea
          rows={4}
          onBlur={() => form.validateFields([INPUT_NAME.DESCRIPTION])}
        />
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.IMAGE}
        label="Hình ảnh"
        rules={[
          { required: true, message: "Vui lòng tải lên hình ảnh thương hiệu!" },
        ]}
      >
        <Upload
          accept="image/*"
          listType="picture"
          maxCount={1}
          fileList={images}
          onChange={({ file, fileList }) => {
            setImages(fileList);
            form.setFieldValue(INPUT_NAME.IMAGE, file);
          }}
          onRemove={() => {
            setImages([]);
            form.setFieldValue(INPUT_NAME.IMAGE, null);
            return false;
          }}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Tải hình ảnh lên</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
