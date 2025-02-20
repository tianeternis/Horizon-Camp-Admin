import axios from "@/configs/axios";

export const getDiscountsByProductID = (productID) => {
  return axios.get(`/discount/get/${productID}`);
};
