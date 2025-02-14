import "@/assets/css/auth.css";
import logo from "@/assets/images/logo.webp";
import loginImg from "@/assets/images/login-img.webp";
import { useDynamicTitle } from "@/hooks";
import LoginForm from "@/components/auth/login/LoginForm";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Login = ({}) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  if (isAuth) return <Navigate to="/not-found" />;

  useDynamicTitle("Đăng nhập");

  return (
    <div className="login h-screen w-full bg-main-bg">
      <div className="flex">
        <div className="flex h-screen w-3/10 shrink-0 items-center justify-center bg-white">
          <div className="w-full shrink-0 space-y-14 p-10">
            <div className="flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                loading="lazy"
                className="w-28 shrink-0 object-cover"
              />
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
