import axios from "@/configs/axios";

export const createNewBrand = ({ name, description, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);

  return axios.post(`/brand/create`, formData);
};

export const editBrand = (id, { name, description, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);

  return axios.put(`/brand/edit/${id}`, formData);
};

export const getBrands = (search, sort, page, limit) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (sort) params.append("sort", sort);

  return axios.get(`/brand/get?${params.toString()}`);
};

export const getBrand = (id) => {
  return axios.get(`/brand/get/id/${id}`);
};
