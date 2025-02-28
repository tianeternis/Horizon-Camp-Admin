import axios from "@/configs/axios";

export const getUsers = (search, role, status, gender, sort, page, limit) => {
  return axios.get(`/user/get-for-admin`, {
    params: { search, role, status, gender, sort, page, limit },
  });
};

export const getRoles = () => {
  return axios.get(`/user/get-roles`);
};

export const addUser = (data) => {
  return axios.post(`/user/add-user`, data);
};

export const deleteUser = (id) => {
  return axios.delete(`/user/delete-user/${id}`);
};

export const getUserByID = (id) => {
  return axios.get(`/user/get/${id}`);
};

export const editUser = (id, data) => {
  return axios.put(`/user/edit-user/${id}`, data);
};
