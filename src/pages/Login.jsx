import logo from "@/assets/images/logo.webp";
import loginImg from "@/assets/images/login-img.webp";
import { useDynamicTitle } from "@/hooks";
import LoginForm from "@/components/auth/login/LoginForm";
import { Link } from "react-router-dom";

const Login = ({}) => {
  useDynamicTitle("Đăng nhập");

  return (
    <div className="h-screen w-full bg-main-bg">
      <div className="flex">
        <div className="w-3/10 h-screen shrink-0 bg-white">
          <div className="space-y-12 p-10">
            <div className="flex items-center justify-center">
              <Link to="/" className="w-fit">
                <img
                  src={logo}
                  alt="Logo"
                  loading="lazy"
                  className="w-28 shrink-0 object-cover"
                />
              </Link>
            </div>
            <div className="text-center text-3xl font-semibold">Đăng nhập</div>
            <div>
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="flex grow items-center justify-center">
          <img
            src={loginImg}
            alt="Login Image"
            loading="lazy"
            className="w-1/2 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
