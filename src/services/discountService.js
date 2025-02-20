import axios from "@/configs/axios";

export const getDiscountsByProductID = (productID) => {
  return axios.get(`/discount/get/${productID}`);
};

export const editCurrentDiscount = (discountID, productID, data) => {
  return axios.put(
    `/discount/edit/current-discount/${discountID}/product/${productID}`,
    data,
  );
};

export const createNewDiscountForProduct = (data) => {
  return axios.post(`/discount/create`, data);
};

export const editFutureDiscount = (discountID, productID, data) => {
  return axios.put(
    `/discount/edit/future-discount/${discountID}/product/${productID}`,
    data,
  );
};

export const deleteDiscount = (id) => {
  return axios.delete(`/discount/delete/${id}`);
};
