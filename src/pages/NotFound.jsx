import { useDynamicTitle } from "@/hooks";
import logo from "@/assets/images/logo.webp";
import notfound from "@/assets/images/404-error.webp";
import { Link } from "react-router-dom";

const NotFound = ({}) => {
  useDynamicTitle("404 Không tìm thấy trang");

  return (
    <div className="h-screen w-full bg-main-bg">
      <div className="w-full px-8 py-6">
        <Link to="/" className="block w-fit">
          <img
            src={logo}
            alt="Logo"
            loading="lazy"
            className="w-20 object-cover"
          />
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="space-y-16">
          <div className="space-y-4 text-center">
            <p className="text-3xl font-bold">Xin lỗi, không tìm thấy trang!</p>
            <p className="mx-auto w-3/5 text-base font-medium text-gray-600">
              Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có
              lẽ bạn đã gõ nhầm URL? Hãy chắc chắn kiểm tra chính tả của bạn.
            </p>
          </div>
          <div className="mx-auto w-1/2">
            <img
              src={notfound}
              alt="404 Không tìm thấy trang"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <Link
              to="/"
              className="rounded-3xl bg-main px-12 py-3 text-15px text-white hover:bg-orange-500"
            >
              Quay về Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
