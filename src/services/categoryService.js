import axios from "@/configs/axios";

export const createNewCategory = ({ name, description, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);

  return axios.post(`/category/create`, formData);
};

export const editCategory = (id, { name, description, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);

  return axios.put(`/category/edit/${id}`, formData);
};

export const getCategories = (search, sort, page, limit) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (sort) params.append("sort", sort);

  return axios.get(`/category/get?${params.toString()}`);
};

export const getCategoryByID = (id) => {
  return axios.get(`/category/get/id/${id}`);
};
