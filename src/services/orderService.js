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

export const acceptOrder = (id) => {
  return axios.put(`/order/accept-order/${id}`);
};

export const completePreparingOrder = (id) => {
  return axios.put(`/order/complete-preparing/${id}`);
};

export const completeOrder = (id) => {
  return axios.put(`/order/complete-order/${id}`);
};

export const cancelOrder = (id) => {
  return axios.put(`/order/cancel/${id}`, { admin: true });
};
