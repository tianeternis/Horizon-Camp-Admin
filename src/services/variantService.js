import axios from "@/configs/axios";

export const createNewColor = (data) => {
  return axios.post(`/variant/create-color`, data);
};

export const createNewSize = (data) => {
  return axios.post(`/variant/create-size`, data);
};

export const getColors = () => {
  return axios.get(`/variant/get-colors`);
};

export const getSizes = () => {
  return axios.get(`/variant/get-sizes`);
};
