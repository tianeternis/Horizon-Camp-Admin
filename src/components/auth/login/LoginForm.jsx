import { PASSWORD_MAX, PASSWORD_MIN } from "@/constants";
import { Form, Button } from "antd";

const INPUT_NAME = {
  EMAIL: "email",
  PASSWORD: "password",
};

const LoginForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <Form
      form={form}
      name="login-form"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      requiredMark={false}
    >
      <Form.Item
        name={INPUT_NAME.EMAIL}
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
        // help={<></>}
      >
        <div className="flex flex-col-reverse gap-1">
          <input
            id={`login-input-${INPUT_NAME.EMAIL}`}
            type="email"
            placeholder="example@gmail.com"
            className="peer block w-full rounded-xl border border-solid border-gray-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-main"
            onChange={(e) =>
              form.setFieldValue(INPUT_NAME.EMAIL, e.target.value)
            }
            onBlur={() => form.validateFields([INPUT_NAME.EMAIL])}
          />
          <label
            htmlFor={`login-input-${INPUT_NAME.EMAIL}`}
            className="text-base font-semibold peer-focus:text-main"
          >
            Email *
          </label>
        </div>
      </Form.Item>
      <Form.Item
        name={INPUT_NAME.PASSWORD}
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
        help={<></>}
      >
        <div className="flex flex-col-reverse gap-1">
          <input
            id={`login-input-${INPUT_NAME.PASSWORD}`}
            type="password"
            placeholder={`Ít nhất ${PASSWORD_MIN} ký tự`}
            className="peer block w-full rounded-xl border border-solid border-gray-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-main"
            onChange={(e) =>
              form.setFieldValue(INPUT_NAME.PASSWORD, e.target.value)
            }
            onBlur={() => form.validateFields([INPUT_NAME.PASSWORD])}
          />
          <label
            htmlFor={`login-input-${INPUT_NAME.PASSWORD}`}
            className="text-base font-semibold peer-focus:text-main"
          >
            Mật khẩu *
          </label>
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
