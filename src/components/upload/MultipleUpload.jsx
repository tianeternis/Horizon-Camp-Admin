import "@/assets/css/upload.css";
import { Form, Image, Upload } from "antd";
import { useEffect, useState } from "react";

const MultipleUpload = ({
  name,
  label = <></>,
  form,
  rules = [],
  maxCount = 10,
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
          multiple
          accept={accept}
          listType={listType}
          maxCount={maxCount}
          fileList={images}
          onChange={({ fileList }) => {
            setImages(fileList);
            form.setFieldsValue({
              [name]: fileList.map((file) => file.originFileObj || file),
            });
          }}
          onRemove={(file) => {
            const newFileList = images.filter((item) => item.uid !== file.uid);
            setImages(newFileList);
            form.setFieldsValue({
              [name]: newFileList.map((file) => file.originFileObj || file),
            });
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
          {images.length >= maxCount ? null : children}
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

export default MultipleUpload;
