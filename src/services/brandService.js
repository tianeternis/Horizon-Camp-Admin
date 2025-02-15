import axios from "@/configs/axios";

export const createNewBrand = ({ name, description, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);

  return axios.post(`/brand/create`, formData);
};

export const getBrands = (search, page, limit) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  return axios.get(`/brand/get?${params.toString()}`);
};
