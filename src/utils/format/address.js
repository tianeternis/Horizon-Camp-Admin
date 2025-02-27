export const formatAddress = ({
  details = "",
  ward = "",
  district = "",
  province = "",
}) => {
  const parts = [details, ward, district, province]; // Tạo mảng chứa các thành phần của địa chỉ
  return parts.filter((part) => part).join(", "); // Lọc ra các phần không rỗng và nối lại thành chuỗi
};
