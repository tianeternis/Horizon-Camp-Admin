import { PASSWORD_MAX, PASSWORD_MIN } from "@/constants";
import { loginSuccess } from "@/redux/reducer/userSlice";
import { login } from "@/services/authService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Form, Button, Input } from "antd";
import { MdKey, MdKeyOff } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const INPUT_NAME = {
  EMAIL: "email",
  PASSWORD: "password",
};

const LoginForm = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const res = await login(values);

    if (res && res.EC === StatusCodes.SUCCESS) {
      dispatch(loginSuccess(res.DT));
      navigate("/", { replace: true });
    }

    if (res && res.EC === StatusCodes.ERRROR) {
      toast.error(res.EM);
    }
  };

  return (
    <Form
      form={form}
      name="login-form"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      requiredMark={false}
      className="login-form"
    >
      <Form.Item
        name={INPUT_NAME.EMAIL}
        label={<span className="text-base font-semibold">Email *</span>}
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
        className="form-input-item"
      >
        <Input
          placeholder="example@gmail.com"
          onBlur={() => form.validateFields([INPUT_NAME.EMAIL])}
          className="login-input"
        />
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.PASSWORD}
        label={<span className="text-base font-semibold">Mật khẩu *</span>}
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          {
            min: PASSWORD_MIN,
            message: `Mật khẩu phải có ít nhất ${PASSWORD_MIN} ký tự!`,
          },
          {
            max: PASSWORD_MAX,
            message: `Mật khẩu phải có nhiều nhất ${PASSWORD_MAX} ký tự!`,
          },
        ]}
        className="form-input-item"
      >
        <Input.Password
          placeholder={`Ít nhất ${PASSWORD_MIN} ký tự`}
          onBlur={() => form.validateFields([INPUT_NAME.PASSWORD])}
          iconRender={(visible) => (
            <div>{visible ? <MdKey /> : <MdKeyOff />}</div>
          )}
          className="login-input"
        />
      </Form.Item>
      <Form.Item>
        <div className="-mt-7 w-full text-right font-medium">
          <Link className="text-main hover:text-orange-600">
            Quên mật khẩu?
          </Link>
        </div>
      </Form.Item>
      <Form.Item className="form-btn-item">
        <Button htmlType="submit" className="form-submit-btn">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
