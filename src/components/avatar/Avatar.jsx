import { UserOutlined } from "@ant-design/icons";
import { Avatar as Avt } from "antd";

const Avatar = ({ size = 32, src, ...props }) => {
  return (
    <div className="relative flex items-center">
      <Avt
        size={size}
        style={{
          backgroundColor: "#fff",
          color: "#ccc",
        }}
        icon={<UserOutlined />}
        src={src || undefined}
        {...props}
      />
    </div>
  );
};

export default Avatar;
