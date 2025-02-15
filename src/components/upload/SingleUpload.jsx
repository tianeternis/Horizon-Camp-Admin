import { Form, Image, Upload } from "antd";
import { useState } from "react";

const SingleUpload = ({
  name,
  form,
  rules = [],
  accept = "image/*",
  listType = "picture",
  children,
}) => {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState({
    visible: false,
    image: "",
  });

  return (
    <div>
      <Form.Item name={name} rules={rules} noStyle>
        <Upload
          accept={accept}
          listType={listType}
          maxCount={1}
          fileList={images}
          onChange={({ file, fileList }) => {
            setImages(fileList);
            form.setFieldsValue({ [name]: file });
          }}
          onRemove={() => {
            setImages([]);
            form.setFieldsValue({ [name]: null });
            return false;
          }}
          onPreview={(file) => {
            setPreviewImage({
              visible: true,
              image: URL.createObjectURL(file?.originFileObj),
            });
          }}
          beforeUpload={() => false}
        >
          {children}
        </Upload>
      </Form.Item>
      {previewImage.visible && previewImage.image && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewImage.visible,
            onVisibleChange: (visible) => {
              if (visible) {
                setPreviewImage((prev) => ({ ...prev, visible }));
              } else {
                URL.revokeObjectURL(previewImage.image);
                setPreviewImage({ visible, image: "" });
              }
            },
          }}
          src={previewImage.image}
        />
      )}
    </div>
  );
};

export default SingleUpload;
