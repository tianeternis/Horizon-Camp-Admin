import "@/assets/css/scrollbar.css";
import SingleUpload from "@/components/upload/SingleUpload";
import { getRoles } from "@/services/userService";
import StatusCodes from "@/utils/status/StatusCodes";
import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { USER_ROLE } from "../constants";

const INPUT_NAME = {
  FULLNAME: "fullName",
  EMAIL: "email",
  PHONE: "phone",
  BIRTHDAY: "birthday",
  GENDER: "gender",
  ROLE: "role",
};

const UserForm = ({
  name = "",
  handleSave = (data) => {},
  edit = { editable: false, initialValue: null },
}) => {
  const [form] = Form.useForm();

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await getRoles();

      if (res && res.EC === StatusCodes.SUCCESS) {
        const data = res.DT;
        const newData = data?.filter(
          (item) => item?.name !== USER_ROLE.customer,
        );
        setRoles(newData);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (edit && edit.editable && edit.initialValue) {
      const values = edit?.initialValue;
      form.setFieldsValue({
        [INPUT_NAME.FULLNAME]: values?.fullName,
        [INPUT_NAME.EMAIL]: values?.email,
        [INPUT_NAME.PHONE]: values?.phone,
        [INPUT_NAME.GENDER]: values?.gender,
        [INPUT_NAME.ROLE]: values?.roleID,
        [INPUT_NAME.BIRTHDAY]: values?.birthday
          ? dayjs(values?.birthday)
          : null,
      });
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
      <Form.Item
        name={INPUT_NAME.FULLNAME}
        label="Họ và tên"
        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
      >
        <Input onBlur={() => form.validateFields([INPUT_NAME.FULLNAME])} />
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.EMAIL}
        label="Email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input
          onBlur={() => form.validateFields([INPUT_NAME.EMAIL])}
          disabled={edit && edit?.editable}
        />
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.PHONE}
        label="Số điện thoại"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại!" },
          {
            pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
            message: "Số điện thoại không hợp lệ!",
          },
        ]}
      >
        <Input onBlur={() => form.validateFields([INPUT_NAME.PHONE])} />
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.ROLE}
        label="Vai trò"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn một vai trò!",
          },
        ]}
      >
        <Select
          placeholder="Chọn vai trò"
          showSearch
          optionFilterProp="children"
        >
          {roles.length > 0 &&
            roles.map((role, i) => (
              <Select.Option
                key={`user-form-role-selection-option-${i}-${role?._id}`}
                value={role?._id}
              >
                {role?.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.GENDER}
        label="Giới tính"
        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
      >
        <Radio.Group>
          <Radio value="male">Nam</Radio>
          <Radio value="female">Nữ</Radio>
          <Radio value="other">Khác</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.BIRTHDAY}
        label="Ngày sinh"
        rules={[
          {
            validator(_, value) {
              if (!value) {
                return Promise.reject("Vui lòng nhập ngày sinh!");
              }
              if (dayjs(value).isAfter(dayjs(), "day")) {
                return Promise.reject("Ngày sinh phải nhỏ hơn ngày hiện tại!");
              }
              return Promise.resolve();
            },
          },
        ]}
        required
        initialValue={null}
      >
        <DatePicker
          style={{ width: "100%" }}
          format={"DD/MM/YYYY"}
          placeholder="Chọn ngày"
          disabledDate={(current) => {
            return current && current >= dayjs().startOf("day");
          }}
          onBlur={() => form.validateFields([INPUT_NAME.BIRTHDAY])}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;
