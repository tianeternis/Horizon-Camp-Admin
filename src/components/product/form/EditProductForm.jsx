import "@/assets/css/scrollbar.css";
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { getCategories } from "@/services/categoryService";
import StatusCodes from "@/utils/status/StatusCodes";
import MultipleUpload from "../../upload/MultipleUpload";
import AddColorModal from "../modal/AddColorModal";
import AddSizeModal from "../modal/AddSizeModal";
import { getColors, getSizes } from "@/services/variantService";
import { getBrands } from "@/services/brandService";

const INPUT_NAME = {
  NAME: "name",
  CATEGORY: "categoryID",
  BRAND: "brandID",
  DESCRIPTION: "description",
  IMAGE: "images",
  VISIBLE: "visible",
  ATTRIBUTES: "attributes",
  ATTRIBUTE_NAME: "name",
  ATTRIBUTE_VALUE: "value",
  VARIANTS: "variants",
  QUANTITY: "quantity",
  PRICE: "price",
  COLOR: "colorID",
  SIZE: "sizeID",
};

const EditProductForm = ({
  name = "",
  handleSave = (data) => {},
  initialValues = null,
}) => {
  const [form] = Form.useForm();

  const [initialImages, setInitialImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [coloroptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);

  const [addedImages, setAddedImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const fetchColors = async () => {
    const res = await getColors();

    if (res && res.EC === StatusCodes.SUCCESS) {
      setColorOptions(res.DT);
    }
  };

  const fetchSizes = async () => {
    const res = await getSizes();

    if (res && res.EC === StatusCodes.SUCCESS) {
      setSizeOptions(res.DT);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();

      if (res && res.EC === StatusCodes.SUCCESS) {
        setCategories(res.DT?.data);
      }
    };

    const fetchBrands = async () => {
      const res = await getBrands();

      if (res && res.EC === StatusCodes.SUCCESS) {
        setBrands(res.DT?.data);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchColors();
    fetchSizes();
  }, []);

  useEffect(() => {
    if (initialValues) {
      const {
        name,
        category,
        brand,
        description,
        visible,
        images,
        attributes,
        variants,
      } = initialValues;

      const defaultImages =
        images && images?.length > 0
          ? images?.map((img) => ({
              uid: img?.image?._id,
              name: `${img?.image?.fileName}.png`,
              status: "done",
              url: img?.image?.path,
              productImageID: img?._id,
            }))
          : [];
      setInitialImages(defaultImages);

      const defaultAttributes =
        attributes && attributes?.length > 0
          ? attributes?.map((attribute) => ({
              _id: attribute?._id,
              [INPUT_NAME.ATTRIBUTE_NAME]: attribute?.name,
              [INPUT_NAME.ATTRIBUTE_VALUE]: attribute?.value,
            }))
          : [];

      const defaultVariants =
        variants && variants?.length > 0
          ? variants?.map((variant) => ({
              _id: variant?._id,
              [INPUT_NAME.QUANTITY]: variant?.quantity,
              [INPUT_NAME.PRICE]: variant?.price,
              [INPUT_NAME.COLOR]: variant?.color?._id,
              [INPUT_NAME.SIZE]: variant?.size?._id,
            }))
          : [];

      form.setFieldsValue({
        [INPUT_NAME.VISIBLE]: visible,
        [INPUT_NAME.NAME]: name,
        [INPUT_NAME.DESCRIPTION]: description,
        [INPUT_NAME.CATEGORY]: category?._id,
        [INPUT_NAME.BRAND]: brand?._id,
        [INPUT_NAME.IMAGE]: images?.map((img) => img?.image?.path),
        [INPUT_NAME.ATTRIBUTES]: defaultAttributes,
        [INPUT_NAME.VARIANTS]: defaultVariants,
      });
    }
  }, [initialValues]);

  const handleChangeImage = (file) => {
    setAddedImages((prev) => [...prev, file]);
  };

  const handleRemoveImage = (file) => {
    if (file && file.uid && file.productImageID && file.name) {
      setRemovedImages((prev) => [
        ...prev,
        {
          imageID: file.uid,
          productImageID: file.productImageID,
          imageFileName: file.name,
        },
      ]);
    } else {
      setAddedImages((prev) => {
        const newImages = prev?.filter((item) => item?.uid !== file?.uid);
        return newImages;
      });
    }
  };

  const onFinish = (values) => {
    handleSave({ ...values, addedImages, removedImages });
  };

  return (
    <div>
      <Form
        form={form}
        name={name}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        clearOnDestroy
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Form.Item
              name={INPUT_NAME.VISIBLE}
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Hiển thị sản phẩm này</Checkbox>
            </Form.Item>
          </div>
          <div className="col-span-6">
            <Form.Item
              name={INPUT_NAME.NAME}
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input onBlur={() => form.validateFields([INPUT_NAME.NAME])} />
            </Form.Item>
            <div className="flex gap-4">
              <div className="w-1/2">
                <Form.Item
                  name={INPUT_NAME.CATEGORY}
                  label="Danh mục sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn một danh mục!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn danh mục sản phẩm"
                    showSearch
                    optionFilterProp="children"
                  >
                    {categories.length > 0 &&
                      categories.map((category, i) => (
                        <Select.Option
                          key={`product-form-category-selection-option-${i}-${category?._id}`}
                          value={category?._id}
                        >
                          {category?.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="w-1/2">
                <Form.Item
                  name={INPUT_NAME.BRAND}
                  label="Thương hiệu sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn một thương hiệu!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn thương hiệu sản phẩm"
                    showSearch
                    optionFilterProp="children"
                  >
                    {brands.length > 0 &&
                      brands.map((brand, i) => (
                        <Select.Option
                          key={`product-form-brand-selection-option-${i}-${brand?._id}`}
                          value={brand?._id}
                        >
                          {brand?.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <Form.Item
              name={INPUT_NAME.DESCRIPTION}
              label="Mô tả sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              ]}
            >
              <Input.TextArea
                rows={6}
                spellCheck={false}
                onBlur={() => form.validateFields([INPUT_NAME.DESCRIPTION])}
                className="custom-scrollbar"
              />
            </Form.Item>
          </div>
          <div className="col-span-6">
            <Form.Item noStyle>
              <MultipleUpload
                label="Hình ảnh"
                name={INPUT_NAME.IMAGE}
                form={form}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải lên hình ảnh sản phẩm!",
                  },
                ]}
                listType="picture-card"
                maxCount={10}
                initialImages={initialImages}
                handleChangeImage={handleChangeImage}
                handleRemoveImage={handleRemoveImage}
              >
                <button type="button" className="border-0 bg-none">
                  <PlusOutlined />
                  <div className="mt-2">Tải ảnh</div>
                </button>
              </MultipleUpload>
            </Form.Item>
          </div>
        </div>
        <Form.Item label="Các thuộc tính sản phẩm" style={{ marginBottom: 0 }}>
          <Form.List name={INPUT_NAME.ATTRIBUTES}>
            {(fields, { add, remove }) => (
              <div className="grid grid-cols-12 gap-x-6">
                {fields
                  .filter(({ name }) => {
                    const attributes = form.getFieldValue(
                      INPUT_NAME.ATTRIBUTES,
                    );
                    return !attributes[name]?.delete;
                  })
                  .map(({ key, name, ...restField }) => (
                    <div key={key} className="col-span-6">
                      <div className="mb-2 flex gap-2 align-baseline">
                        <Form.Item
                          {...restField}
                          name={[name, INPUT_NAME.ATTRIBUTE_NAME]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên thuộc tính!",
                            },
                          ]}
                          style={{ flexGrow: 1 }}
                        >
                          <Input placeholder="Tên thuộc tính" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, INPUT_NAME.ATTRIBUTE_VALUE]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập giá trị thuộc tính!",
                            },
                          ]}
                          style={{ flexGrow: 1 }}
                        >
                          <Input placeholder="Giá trị thuộc tính" />
                        </Form.Item>
                        <Form.Item>
                          <MinusCircleOutlined
                            onClick={() => {
                              const attributes = form.getFieldValue(
                                INPUT_NAME.ATTRIBUTES,
                              );

                              if (attributes[name]?._id) {
                                attributes[name].delete = true;
                                form.setFieldsValue({
                                  [INPUT_NAME.ATTRIBUTES]: attributes,
                                });
                              } else {
                                remove(name);
                              }
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                <div className="col-span-2">
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({ add: true })}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm thuộc tính
                    </Button>
                  </Form.Item>
                </div>
              </div>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label="Các biến thể sản phẩm"
          name={INPUT_NAME.VARIANTS}
          rules={[
            ({ getFieldValue }) => {
              const value = getFieldValue(INPUT_NAME.VARIANTS);
              return {
                validator() {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      "Vui lòng tạo ít nhất là 1 biến thế!",
                    );
                  }

                  return Promise.resolve();
                },
              };
            },
          ]}
        >
          <Form.List
            name={INPUT_NAME.VARIANTS}
            rules={[
              {
                validator(_, value) {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      "Vui lòng tạo ít nhất là 1 biến thế!",
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <div className="grid grid-cols-12 gap-6">
                {fields
                  .filter(({ name }) => {
                    const variant = form.getFieldValue(INPUT_NAME.VARIANTS);
                    return !variant[name]?.delete;
                  })
                  .map((field) => (
                    <div key={field.key} className="col-span-6">
                      <Card
                        size="small"
                        title={`Biến thể ${field.name + 1}`}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              const variants = form.getFieldValue(
                                INPUT_NAME.VARIANTS,
                              );

                              if (variants[field.name]?._id) {
                                variants[field.name].delete = true;
                                form.setFieldsValue({
                                  [INPUT_NAME.VARIANTS]: variants,
                                });
                              } else {
                                remove(field.name);
                              }
                            }}
                          />
                        }
                      >
                        <div className="flex gap-4">
                          <div className="w-1/2">
                            <Form.Item
                              name={[field.name, INPUT_NAME.QUANTITY]}
                              label="Số lượng"
                              rules={[
                                {
                                  type: "number",
                                  min: 1,
                                  message: "Số lượng sản phẩm phải lớn hơn 0!",
                                },
                                {
                                  required: true,
                                  message: "Vui lòng nhập số lượng sản phẩm!",
                                },
                              ]}
                            >
                              <InputNumber min={1} style={{ width: "100%" }} />
                            </Form.Item>
                          </div>
                          <div className="w-1/2">
                            <Form.Item
                              name={[field.name, INPUT_NAME.PRICE]}
                              label="Giá bán"
                              rules={[
                                {
                                  type: "number",
                                  min: 1,
                                  message: "Giá bán phải lớn hơn 0!",
                                },
                                {
                                  required: true,
                                  message: "Vui lòng nhập giá bán!",
                                },
                              ]}
                            >
                              <InputNumber min={1} style={{ width: "100%" }} />
                            </Form.Item>
                          </div>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-grow">
                            <Form.Item
                              name={[field.name, INPUT_NAME.SIZE]}
                              label="Kích thước"
                            >
                              <Select
                                placeholder="Chọn kích thước"
                                showSearch
                                optionFilterProp="children"
                              >
                                {sizeOptions.length > 0 &&
                                  sizeOptions.map((size, i) => (
                                    <Select.Option
                                      key={`product-form-size-selection-option-${i}-${size?._id}`}
                                      value={size?._id}
                                    >
                                      {size?.name}
                                    </Select.Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => setShowAddSizeModal(true)}
                            >
                              Thêm mới
                            </Button>
                          </Form.Item>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-grow">
                            <Form.Item
                              name={[field.name, INPUT_NAME.COLOR]}
                              label="Màu sắc"
                            >
                              <Select
                                placeholder="Chọn màu sắc"
                                showSearch
                                filterOption={(input, option) =>
                                  option?.children?.props?.children?.[1]?.props?.children
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              >
                                {coloroptions.length > 0 &&
                                  coloroptions.map((color, i) => (
                                    <Select.Option
                                      key={`product-form-color-selection-option-${i}-${color?._id}`}
                                      value={color?._id}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <div
                                          style={{
                                            background: color?.hex,
                                            border:
                                              color?.hex === "#ffffff"
                                                ? "1px solid #d1d5db"
                                                : "none",
                                          }}
                                          className="rounded-full p-2"
                                        ></div>
                                        <span>{color?.name}</span>
                                      </div>
                                    </Select.Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => setShowAddColorModal(true)}
                            >
                              Thêm mới
                            </Button>
                          </Form.Item>
                        </div>
                      </Card>
                    </div>
                  ))}
                <div className="col-span-2">
                  <Button
                    type="dashed"
                    onClick={() => {
                      add({ add: true });
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm biến thể
                  </Button>
                </div>
              </div>
            )}
          </Form.List>
        </Form.Item>
      </Form>

      {showAddColorModal && (
        <AddColorModal
          open={showAddColorModal}
          handleClose={() => setShowAddColorModal(false)}
          refetch={fetchColors}
        />
      )}
      {showAddSizeModal && (
        <AddSizeModal
          open={showAddSizeModal}
          handleClose={() => setShowAddSizeModal(false)}
          refetch={fetchSizes}
        />
      )}
    </div>
  );
};

export default EditProductForm;
