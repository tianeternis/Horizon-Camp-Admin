import axios from "../configs/axios";

export const getPaymentMethods = () => {
  return axios.get(`/order/get-payment-methods`);
};

export const getPaymentStatuses = () => {
  return axios.get(`/order/get-payment-statuses`);
};

export const getOrders = (
  orderStatus,
  paymentMethod,
  paymentStatus,
  sort,
  search,
  page,
  limit,
) => {
  return axios.get(`/order/get-all`, {
    params: {
      orderStatus,
      paymentMethod,
      paymentStatus,
      sort,
      search,
      page,
      limit,
    },
  });
};

export const getOrderByID = (id) => {
  return axios.get(`/order/get-order-detail/${id}`);
};
