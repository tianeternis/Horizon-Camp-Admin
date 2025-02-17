import "@/assets/css/scrollbar.css";
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { getCategories } from "@/services/categoryService";
import StatusCodes from "@/utils/status/StatusCodes";
import MultipleUpload from "../../upload/MultipleUpload";
import dayjs from "dayjs";
import AddColorModal from "../modal/AddColorModal";
import AddSizeModal from "../modal/AddSizeModal";
import { getColors, getSizes } from "@/services/variantService";

const INPUT_NAME = {
  NAME: "name",
  CATEGORY: "category",
  DESCRIPTION: "description",
  DISCOUNT: "discount",
  DISCOUNT_START_DATE: "discountStartDate",
  DISCOUNT_END_DATE: "discountEndDate",
  IMAGE: "image",
  VISIBLE: "visible",
  ATTRIBUTES: "attributes",
  ATTRIBUTE_NAME: "name",
  ATTRIBUTE_VALUE: "value",
  VARIANTS: "variants",
  QUANTITY: "quantity",
  PRICE: "price",
  PRICE_APPLIED_DATE: "priceAppliedDate",
  COLOR: "color",
  SIZE: "size",
};

const ProductForm = ({
  name = "",
  handleSave = (data) => {},
  edit = { editable: false, initialValue: null },
}) => {
  const [form] = Form.useForm();

  const [initialImages, setInitialImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coloroptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);

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

    fetchCategories();
    fetchColors();
    fetchSizes();
  }, []);

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
              initialValue={true}
              noStyle
            >
              <Checkbox>Hiển thị sản phẩm này</Checkbox>
            </Form.Item>
          </div>
          <div className="col-span-5">
            <Form.Item
              name={INPUT_NAME.NAME}
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input onBlur={() => form.validateFields([INPUT_NAME.NAME])} />
            </Form.Item>
            <Form.Item
              name={INPUT_NAME.CATEGORY}
              label="Danh mục sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn một danh mục sản phẩm!",
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
            <Form.Item
              name={INPUT_NAME.DESCRIPTION}
              label="Mô tả sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              ]}
            >
              <Input.TextArea
                rows={5}
                spellCheck={false}
                onBlur={() => form.validateFields([INPUT_NAME.DESCRIPTION])}
                className="custom-scrollbar"
              />
            </Form.Item>
          </div>
          <div className="col-span-7">
            <div className="flex items-center gap-4">
              <div className="w-1/3">
                <Form.Item
                  name={INPUT_NAME.DISCOUNT}
                  label="Giảm giá (%)"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      message: "Giá trị giảm giá phải từ 0% đến 100%",
                    },
                  ]}
                  initialValue={0}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    addonAfter="%"
                    onBlur={() => form.validateFields([INPUT_NAME.DISCOUNT])}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="w-1/3">
                <Form.Item dependencies={[INPUT_NAME.DISCOUNT]} noStyle>
                  {({ getFieldValue }) => (
                    <Form.Item
                      name={INPUT_NAME.DISCOUNT_START_DATE}
                      label="Ngày bắt đầu giảm giá"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              getFieldValue(INPUT_NAME.DISCOUNT) > 0 &&
                              !value
                            ) {
                              return Promise.reject(
                                "Vui lòng nhập ngày bắt đầu!",
                              );
                            }
                            if (dayjs(value).isBefore(dayjs(), "day")) {
                              return Promise.reject(
                                "Ngày bắt đầu phải lớn hơn ngày hiện tại!",
                              );
                            }
                            if (
                              getFieldValue(INPUT_NAME.DISCOUNT) === 0 &&
                              value
                            ) {
                              return Promise.reject(
                                "Không được chọn ngày khi không có giảm giá!",
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      initialValue={null}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        placeholder="Chọn ngày"
                        disabledDate={(current) => {
                          return current && current < dayjs().startOf("day");
                        }}
                        onBlur={() =>
                          form.validateFields([INPUT_NAME.DISCOUNT_START_DATE])
                        }
                        disabled={
                          getFieldValue(INPUT_NAME.DISCOUNT) === 0 ||
                          getFieldValue(INPUT_NAME.DISCOUNT) === null
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
              <div className="w-1/3">
                <Form.Item
                  dependencies={[
                    INPUT_NAME.DISCOUNT,
                    INPUT_NAME.DISCOUNT_START_DATE,
                  ]}
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <Form.Item
                      name={INPUT_NAME.DISCOUNT_END_DATE}
                      label="Ngày kết thúc giảm giá"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              getFieldValue(INPUT_NAME.DISCOUNT) > 0 &&
                              !value
                            ) {
                              return Promise.reject(
                                "Vui lòng nhập ngày kết thúc!",
                              );
                            }
                            if (
                              getFieldValue(INPUT_NAME.DISCOUNT) === 0 &&
                              value
                            ) {
                              return Promise.reject(
                                "Không được chọn ngày khi không có giảm giá!",
                              );
                            }
                            if (
                              getFieldValue(INPUT_NAME.DISCOUNT_START_DATE) &&
                              (dayjs(value).isBefore(
                                dayjs(
                                  getFieldValue(INPUT_NAME.DISCOUNT_START_DATE),
                                ),
                                "day",
                              ) ||
                                dayjs(value).isSame(
                                  dayjs(
                                    getFieldValue(
                                      INPUT_NAME.DISCOUNT_START_DATE,
                                    ),
                                  ),
                                  "day",
                                ))
                            ) {
                              return Promise.reject(
                                "Ngày kết thúc phải lớn hơn ngày bắt đầu!",
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      initialValue={null}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        placeholder="Chọn ngày"
                        disabledDate={(current) => {
                          const startDate = form.getFieldValue(
                            INPUT_NAME.DISCOUNT_START_DATE,
                          );
                          return (
                            current &&
                            (!current.isAfter(dayjs(startDate), "day") ||
                              !current.isAfter(dayjs(), "day"))
                          );
                        }}
                        onBlur={() =>
                          form.validateFields([INPUT_NAME.DISCOUNT_END_DATE])
                        }
                        disabled={
                          getFieldValue(INPUT_NAME.DISCOUNT) === 0 ||
                          getFieldValue(INPUT_NAME.DISCOUNT) === null ||
                          getFieldValue(INPUT_NAME.DISCOUNT_START_DATE) === null
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
            </div>
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
                initialImages={initialImages}
                listType="picture-card"
                maxCount={10}
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
                {fields.map(({ key, name, ...restField }) => (
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
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Form.Item>
                    </div>
                  </div>
                ))}
                <div className="col-span-2">
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
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
        <Form.Item label="Các biến thể sản phẩm">
          <Form.List name={INPUT_NAME.VARIANTS}>
            {(fields, { add, remove }) => (
              <div className="grid grid-cols-12 gap-6">
                {fields.map((field) => (
                  <div key={field.key} className="col-span-6">
                    <Card
                      size="small"
                      title={`Biến thể ${field.name + 1}`}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      }
                    >
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
                      <div className="flex gap-4">
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
                        <div className="w-1/2">
                          <Form.Item
                            shouldUpdate={(prev, cur) =>
                              prev?.[INPUT_NAME.VARIANTS]?.[field.name]?.[
                                INPUT_NAME.PRICE
                              ] !==
                              cur?.[INPUT_NAME.VARIANTS]?.[field.name]?.[
                                INPUT_NAME.PRICE
                              ]
                            }
                            noStyle
                          >
                            {({ getFieldValue }) => {
                              const price = getFieldValue([
                                INPUT_NAME.VARIANTS,
                                field.name,
                                INPUT_NAME.PRICE,
                              ]);

                              return (
                                <Form.Item
                                  name={[
                                    field.name,
                                    INPUT_NAME.PRICE_APPLIED_DATE,
                                  ]}
                                  label="Ngày áp dụng giá bán"
                                  rules={[
                                    ({ getFieldValue }) => {
                                      const validatorPrice = getFieldValue([
                                        INPUT_NAME.VARIANTS,
                                        field.name,
                                        INPUT_NAME.PRICE,
                                      ]);

                                      return {
                                        validator(_, value) {
                                          if (validatorPrice > 0 && !value) {
                                            return Promise.reject(
                                              "Vui lòng nhập ngày áp dụng!",
                                            );
                                          }
                                          if (
                                            dayjs(value).isBefore(
                                              dayjs(),
                                              "day",
                                            )
                                          ) {
                                            return Promise.reject(
                                              "Ngày áp dụng phải lớn hơn ngày hiện tại!",
                                            );
                                          }
                                          if (
                                            (validatorPrice === 0 ||
                                              validatorPrice === null ||
                                              validatorPrice === undefined) &&
                                            value
                                          ) {
                                            return Promise.reject(
                                              "Không được chọn ngày khi không có giá bán!",
                                            );
                                          }
                                          return Promise.resolve();
                                        },
                                      };
                                    },
                                  ]}
                                  initialValue={null}
                                >
                                  <DatePicker
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                    placeholder="Chọn ngày"
                                    disabledDate={(current) => {
                                      return (
                                        current &&
                                        current < dayjs().startOf("day")
                                      );
                                    }}
                                    disabled={
                                      price === 0 ||
                                      price === undefined ||
                                      price === null
                                    }
                                  />
                                </Form.Item>
                              );
                            }}
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
                              optionFilterProp="children"
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
                    onClick={() => add()}
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

export default ProductForm;
