import "@/assets/css/scrollbar.css";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import SingleUpload from "../upload/SingleUpload";
import { getCategories } from "@/services/categoryService";
import StatusCodes from "@/utils/status/StatusCodes";
import MultipleUpload from "../upload/MultipleUpload";
import dayjs from "dayjs";

const INPUT_NAME = {
  NAME: "name",
  CATEGORY: "category",
  DESCRIPTION: "description",
  DISCOUNT: "discount",
  DISCOUNT_START_DATE: "discountStartDate",
  DISCOUNT_END_DATE: "discountEndDate",
  IMAGE: "image",
  VISIBLE: "visible",
};

const ProductForm = ({
  name = "",
  handleSave = (data) => {},
  edit = { editable: false, initialValue: null },
}) => {
  const [form] = Form.useForm();

  const [initialImages, setInitialImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();

      if (res && res.EC === StatusCodes.SUCCESS) {
        setCategories(res.DT?.data);
      }
    };

    fetchCategories();
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
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
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
                              "Ngày bắt đầu nhỏ hơn ngày hiện tại!",
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
                                  getFieldValue(INPUT_NAME.DISCOUNT_START_DATE),
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
                        getFieldValue(INPUT_NAME.DISCOUNT_START_DATE) ===
                          undefined
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
    </Form>
  );
};

export default ProductForm;
