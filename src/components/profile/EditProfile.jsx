import "@/assets/css/profile.css";
import { Button, DatePicker, Form, Input, Radio, Upload } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Avatar from "../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { editProfile, getUserByID } from "@/services/userService";
import StatusCodes from "@/utils/status/StatusCodes";
import { toast } from "react-toastify";
import { updateProfile } from "@/redux/reducer/userSlice";

const INPUT_NAME = {
  FULLNAME: "fullName",
  PHONE: "phone",
  GENDER: "gender",
  BIRTHDAY: "birthday",
  AVATAR: "avatar",
  EMAIL: "email",
  ROLE: "role",
};

const EditProfile = ({}) => {
  const [form] = Form.useForm();

  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const [user, setUser] = useState();

  const [loading, setLoading] = useState(false);

  const account = useSelector((state) => state.user.account);

  const fetchUser = async (id) => {
    const res = await getUserByID(id);

    if (res && res.EC === StatusCodes.SUCCESS) {
      setUser(res.DT);
    }
  };

  useEffect(() => {
    if (account?._id) {
      fetchUser(account?._id);
    }
  }, [account]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        [INPUT_NAME.FULLNAME]: user?.fullName,
        [INPUT_NAME.PHONE]: user?.phone,
        [INPUT_NAME.GENDER]: user?.gender,
        [INPUT_NAME.BIRTHDAY]: user?.birthday
          ? dayjs(user?.birthday)
          : undefined,
        [INPUT_NAME.AVATAR]: user?.avatar,
        [INPUT_NAME.EMAIL]: user?.email,
        [INPUT_NAME.ROLE]: user?.role,
      });

      if (user?.avatar) {
        setImages([
          {
            uid: "-1",
            name: `${user?.name}.png`,
            status: "done",
            url: user?.avatar,
          },
        ]);
        setPreviewImage(user?.avatar);
      }
    }
  }, [user]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleRemoveImage = () => {
    setImages([]);
    form.setFieldsValue({ [INPUT_NAME.AVATAR]: "" });
    URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
  };

  const dispatch = useDispatch();
  const onFinish = async (values) => {
    if (user?._id && values) {
      setLoading(true);
      delete values?.email;
      delete values?.role;

      const res = await editProfile(user?._id, values);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        dispatch(updateProfile(res.DT));
        await fetchUser(user?._id);
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }

      setLoading(false);
    }
  };

  return (
    <div className="edit-profie-form divide-y divide-solid divide-gray-200">
      <div className="space-y-1.5 pb-4">
        <p className="text-lg font-bold">Hồ sơ của tôi</p>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <div className="pt-6">
        <div className="mx-auto w-3/4">
          <Form
            form={form}
            name="edit-profile-form"
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
          >
            <div className="grid grid-cols-12 gap-2 text-sm">
              <div className="col-span-8 pr-10">
                <Form.Item
                  name={INPUT_NAME.FULLNAME}
                  label={<span className="font-semibold">Họ và tên</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input
                    onBlur={() => form.validateFields([INPUT_NAME.FULLNAME])}
                    size="large"
                    style={{ fontSize: "14px" }}
                  />
                </Form.Item>
                <Form.Item
                  name={INPUT_NAME.EMAIL}
                  label={<span className="font-semibold">Email</span>}
                >
                  <Input disabled size="large" style={{ fontSize: "14px" }} />
                </Form.Item>
                <Form.Item
                  name={INPUT_NAME.ROLE}
                  label={<span className="font-semibold">Vai trò</span>}
                >
                  <Input disabled size="large" style={{ fontSize: "14px" }} />
                </Form.Item>
                <Form.Item
                  name={INPUT_NAME.PHONE}
                  label={<span className="font-semibold">Số điện thoại</span>}
                  rules={[
                    {
                      pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    onBlur={() => form.validateFields([INPUT_NAME.PHONE])}
                    size="large"
                    style={{ fontSize: "14px" }}
                  />
                </Form.Item>
                <Form.Item
                  name={INPUT_NAME.GENDER}
                  label={<span className="font-semibold">Giới tính</span>}
                >
                  <Radio.Group style={{ fontSize: "14px" }}>
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                    <Radio value="other">Khác</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name={INPUT_NAME.BIRTHDAY}
                  label={<span className="font-semibold">Ngày sinh</span>}
                  rules={[
                    {
                      validator(_, value) {
                        if (value && dayjs(value).isAfter(dayjs(), "day")) {
                          return Promise.reject(
                            "Ngày sinh phải nhỏ hơn ngày hiện tại!",
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    placeholder="Chọn ngày"
                    disabledDate={(current) => {
                      return current && current >= dayjs().startOf("day");
                    }}
                    onBlur={() => form.validateFields([INPUT_NAME.BIRTHDAY])}
                    size="large"
                  />
                </Form.Item>
              </div>
              <div className="col-span-4">
                <div className="flex flex-col items-center gap-6 py-16">
                  <Avatar size={160} src={previewImage} />
                  <div className="flex items-center gap-4">
                    <Form.Item name={INPUT_NAME.AVATAR} style={{ margin: 0 }}>
                      <Upload
                        showUploadList={false}
                        accept="image/*"
                        maxCount={1}
                        fileList={images}
                        onChange={({ file, fileList }) => {
                          setImages(fileList);
                          form.setFieldsValue({ [INPUT_NAME.AVATAR]: file });
                          setPreviewImage(
                            file?.url || URL.createObjectURL(file),
                          );
                        }}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />} type="primary">
                          Tải ảnh lên
                        </Button>
                      </Upload>
                    </Form.Item>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveImage}
                    >
                      Gỡ ảnh
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-span-8 pr-10">
                <Form.Item label={null}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                  >
                    Lưu
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
