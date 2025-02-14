import axios from "@/configs/axios";

export const login = (data) => {
  return axios.post(`/auth/login-for-admin`, data);
};

export const logout = (data) => {
  return axios.post(`/auth/logout`, data);
};
