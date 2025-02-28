import { Button, Form, Input } from "antd";
import SingleUpload from "../upload/SingleUpload";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/constants";
import { MdKey, MdKeyOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "@/services/userService";
import StatusCodes from "@/utils/status/StatusCodes";
import { toast } from "react-toastify";
import { logoutSuccess } from "@/redux/reducer/userSlice";
import { useNavigate } from "react-router-dom";

const INPUT_NAME = {
  CURRENT_PASSWORD: "currentPassword",
  NEW_PASSWORD: "newPassword",
  CONFIRM_NEW_PASSWORD: "confirmNewPassword",
};

const ChangePassword = ({}) => {
  const [form] = Form.useForm();

  const user = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (user?._id) {
      const res = await changePassword(user?._id, values);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        dispatch(logoutSuccess());
        navigate("/login");
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
    }
  };

  return (
    <div className="divide-y divide-solid divide-gray-200">
      <div className="space-y-1.5 pb-4">
        <p className="text-lg font-bold">Đổi mật khẩu</p>
        <p>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>
      <div className="pt-8">
        <div className="mx-auto w-1/2 text-sm">
          <Form
            form={form}
            name="change-password-form"
            onFinish={onFinish}
            layout="horizontal"
            autoComplete="off"
            clearOnDestroy
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            requiredMark={false}
          >
            <Form.Item
              name={INPUT_NAME.CURRENT_PASSWORD}
              label={
                <span className="text-sm font-semibold">Mật khẩu hiện tại</span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
                {
                  min: PASSWORD_MIN,
                  message: `Mật khẩu hiện tại phải có ít nhất ${PASSWORD_MIN} ký tự!`,
                },
                {
                  max: PASSWORD_MAX,
                  message: `Mật khẩu hiện tại phải có nhiều nhất ${PASSWORD_MAX} ký tự!`,
                },
              ]}
            >
              <Input.Password
                onBlur={() =>
                  form.validateFields([INPUT_NAME.CURRENT_PASSWORD])
                }
                iconRender={(visible) => (
                  <div>{visible ? <MdKey /> : <MdKeyOff />}</div>
                )}
                size="large"
                style={{ fontSize: "14px" }}
              />
            </Form.Item>
            <Form.Item
              name={INPUT_NAME.NEW_PASSWORD}
              label={
                <span className="text-sm font-semibold">Mật khẩu mới</span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                {
                  min: PASSWORD_MIN,
                  message: `Mật khẩu mới phải có ít nhất ${PASSWORD_MIN} ký tự!`,
                },
                {
                  max: PASSWORD_MAX,
                  message: `Mật khẩu mới phải có nhiều nhất ${PASSWORD_MAX} ký tự!`,
                },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const currentPassword = getFieldValue(
                      INPUT_NAME.CURRENT_PASSWORD,
                    );

                    if (value && value === currentPassword) {
                      return Promise.reject(
                        "Mật khẩu mới phải khác mật khẩu hiện tại!",
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password
                onBlur={() => form.validateFields([INPUT_NAME.NEW_PASSWORD])}
                iconRender={(visible) => (
                  <div>{visible ? <MdKey /> : <MdKeyOff />}</div>
                )}
                size="large"
                style={{ fontSize: "14px" }}
              />
            </Form.Item>
            <Form.Item
              name={INPUT_NAME.CONFIRM_NEW_PASSWORD}
              label={
                <span className="text-sm font-semibold">Mật khẩu xác nhận</span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu xác nhận!" },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const newPassword = getFieldValue(INPUT_NAME.NEW_PASSWORD);

                    if (value && value !== newPassword) {
                      return Promise.reject(
                        "Mật khẩu xác nhận không khớp với mật khẩu mới!",
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password
                onBlur={() =>
                  form.validateFields([INPUT_NAME.CONFIRM_NEW_PASSWORD])
                }
                iconRender={(visible) => (
                  <div>{visible ? <MdKey /> : <MdKeyOff />}</div>
                )}
                size="large"
                style={{ fontSize: "14px" }}
              />
            </Form.Item>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
