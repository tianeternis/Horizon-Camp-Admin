import axios from "@/configs/axios";

export const getUsers = (search, role, status, gender, sort, page, limit) => {
  return axios.get(`/user/get-for-admin`, {
    params: { search, role, status, gender, sort, page, limit },
  });
};
