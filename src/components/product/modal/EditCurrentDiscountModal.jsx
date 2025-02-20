import { editCurrentDiscount } from "@/services/discountService";
import StatusCodes from "@/utils/status/StatusCodes";
import { DatePicker, Form, InputNumber, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import { toast } from "react-toastify";

const INPUT_NAME = {
  DISCOUNT: "discount",
  DISCOUNT_START_DATE: "discountStartDate",
  DISCOUNT_END_DATE: "discountEndDate",
};

const FORM_NAME = "edit-current-discount-form";

const EditCurrentDiscountModal = ({
  open = false,
  handleClose = () => {},
  discount = null,
  productID,
  refetch = () => {},
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (discount) {
      form.setFieldsValue({
        [INPUT_NAME.DISCOUNT]: discount?.value,
        [INPUT_NAME.DISCOUNT_START_DATE]: dayjs(discount?.startDate),
        [INPUT_NAME.DISCOUNT_END_DATE]: dayjs(discount?.endDate),
      });
    }
  }, [discount]);

  const onFinish = async (values) => {
    const endDate = values?.[INPUT_NAME.DISCOUNT_END_DATE];
    const discountID = discount?._id;

    if (endDate && productID && discountID) {
      setLoading(true);

      const newEndDate = new Date(endDate).toISOString();
      const res = await editCurrentDiscount(discountID, productID, {
        endDate: newEndDate,
      });

      setLoading(false);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        handleClose();
        refetch(productID);
      }

      if (res && res.EC === StatusCodes.CONFLICT_DISCOUNT) {
        setConflict(true);
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
        setConflict(false);
      }
    }
  };

  return (
    <Modal
      title="Chỉnh sửa giảm giá đang được áp dụng"
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
      <div>
        <Form
          form={form}
          name={FORM_NAME}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          clearOnDestroy
        >
          <Form.Item name={INPUT_NAME.DISCOUNT} label="Giảm giá (%)">
            <InputNumber addonAfter="%" style={{ width: "100%" }} disabled />
          </Form.Item>
          <Form.Item dependencies={[INPUT_NAME.DISCOUNT]} noStyle>
            {({ getFieldValue }) => (
              <Form.Item
                name={INPUT_NAME.DISCOUNT_START_DATE}
                label="Ngày bắt đầu giảm giá"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  placeholder="Chọn ngày"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                  disabled
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
                required
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
                />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
        {conflict && (
          <div className="flex items-center gap-2 rounded-md border border-solid border-red-200 bg-red-50 p-2">
            <span className="text-2xl text-red-600">
              <MdError />
            </span>
            <span className="text-justify">
              Không thể thực hiện cập nhật bởi vì đã có chiết khấu đang hoặc chờ
              được áp dụng vào khoảng thời gian bắt đầu hoặc kết thúc này.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditCurrentDiscountModal;
