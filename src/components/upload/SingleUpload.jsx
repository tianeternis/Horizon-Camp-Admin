import "@/assets/css/upload.css";
import { Form, Image, Upload } from "antd";
import { useEffect, useState } from "react";

const SingleUpload = ({
  name,
  label = <></>,
  form,
  rules = [],
  accept = "image/*",
  listType = "picture",
  initialImages,
  children,
}) => {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState({
    visible: false,
    image: "",
  });

  useEffect(() => {
    if (initialImages) {
      setImages(initialImages);
    }
  }, [initialImages]);

  return (
    <div>
      <Form.Item label={label} name={name} rules={rules}>
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
              image: file?.url || URL.createObjectURL(file?.originFileObj),
            });
          }}
          beforeUpload={() => false}
          className="custom-upload"
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
