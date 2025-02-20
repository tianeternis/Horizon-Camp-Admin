import { DatePicker, Form, InputNumber, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const INPUT_NAME = {
  DISCOUNT: "discount",
  DISCOUNT_START_DATE: "discountStartDate",
  DISCOUNT_END_DATE: "discountEndDate",
};

const FORM_NAME = "edit-future-discount-form";

const EditFutureDiscountModal = ({
  open = false,
  handleClose = () => {},
  discount = null,
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (discount) {
      form.setFieldsValue({
        [INPUT_NAME.DISCOUNT]: discount?.value,
        [INPUT_NAME.DISCOUNT_START_DATE]: dayjs(discount?.startDate),
        [INPUT_NAME.DISCOUNT_END_DATE]: dayjs(discount?.endDate),
      });
    }
  }, [discount]);

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Modal
      title="Chỉnh sửa giảm giá"
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
          name={INPUT_NAME.DISCOUNT}
          label="Giảm giá (%)"
          rules={[
            {
              type: "number",
              min: 0,
              max: 100,
              message: "Giá trị giảm giá phải từ 0% đến 100%",
            },
            { required: true, message: "Vui lòng nhập giá trị của giảm giá!" },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            addonAfter="%"
            onBlur={() => form.validateFields([INPUT_NAME.DISCOUNT])}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item dependencies={[INPUT_NAME.DISCOUNT]} noStyle>
          {({ getFieldValue }) => (
            <Form.Item
              name={INPUT_NAME.DISCOUNT_START_DATE}
              label="Ngày bắt đầu giảm giá"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue(INPUT_NAME.DISCOUNT) > 0 && !value) {
                      return Promise.reject("Vui lòng nhập ngày bắt đầu!");
                    }
                    if (dayjs(value).isBefore(dayjs(), "day")) {
                      return Promise.reject(
                        "Ngày bắt đầu phải lớn hơn ngày hiện tại!",
                      );
                    }
                    if (getFieldValue(INPUT_NAME.DISCOUNT) === 0 && value) {
                      return Promise.reject(
                        "Không được chọn ngày khi không có giảm giá!",
                      );
                    }
                    return Promise.resolve();
                  },
                }),
                {
                  required: true,
                  message: "Vui lòng nhập ngày bắt đầu giảm giá",
                },
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
                  !getFieldValue(INPUT_NAME.DISCOUNT) ||
                  getFieldValue(INPUT_NAME.DISCOUNT) === 0
                }
              />
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item
          dependencies={[INPUT_NAME.DISCOUNT, INPUT_NAME.DISCOUNT_START_DATE]}
          noStyle
        >
          {({ getFieldValue }) => (
            <Form.Item
              name={INPUT_NAME.DISCOUNT_END_DATE}
              label="Ngày kết thúc giảm giá"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue(INPUT_NAME.DISCOUNT) > 0 && !value) {
                      return Promise.reject("Vui lòng nhập ngày kết thúc!");
                    }
                    if (getFieldValue(INPUT_NAME.DISCOUNT) === 0 && value) {
                      return Promise.reject(
                        "Không được chọn ngày khi không có giảm giá!",
                      );
                    }
                    if (
                      getFieldValue(INPUT_NAME.DISCOUNT_START_DATE) &&
                      (dayjs(value).isBefore(
                        dayjs(getFieldValue(INPUT_NAME.DISCOUNT_START_DATE)),
                        "day",
                      ) ||
                        dayjs(value).isSame(
                          dayjs(getFieldValue(INPUT_NAME.DISCOUNT_START_DATE)),
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
                {
                  required: true,
                  message: "Vui lòng nhập ngày bắt đầu giảm giá",
                },
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
                  !getFieldValue(INPUT_NAME.DISCOUNT) ||
                  getFieldValue(INPUT_NAME.DISCOUNT) === 0 ||
                  getFieldValue(INPUT_NAME.DISCOUNT_START_DATE) === null
                }
              />
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFutureDiscountModal;
