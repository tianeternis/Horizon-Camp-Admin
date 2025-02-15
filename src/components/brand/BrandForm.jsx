import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Upload } from "antd";
import { useState } from "react";
import SingleUpload from "../upload/SingleUpload";

const INPUT_NAME = {
  NAME: "name",
  DESCRIPTION: "description",
  IMAGE: "image",
};

const BrandForm = ({ name = "", handleSave = (data) => {} }) => {
  const [form] = Form.useForm();

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
          spellCheck={false}
          onBlur={() => form.validateFields([INPUT_NAME.DESCRIPTION])}
        />
      </Form.Item>
      <Form.Item label="Hình ảnh">
        <SingleUpload
          name={INPUT_NAME.IMAGE}
          form={form}
          rules={[
            {
              required: true,
              message: "Vui lòng tải lên hình ảnh thương hiệu!",
            },
          ]}
        >
          <Button icon={<UploadOutlined />}>Tải hình ảnh lên</Button>
        </SingleUpload>
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
