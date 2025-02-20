import axios from "@/configs/axios";

export const createNewProduct = ({
  images,
  attributes,
  variants,
  discountStartDate,
  discountEndDate,
  ...others
}) => {
  const formData = new FormData();

  if (images && images?.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  if (attributes && attributes?.length > 0) {
    formData.append("attributes", JSON.stringify(attributes));
  }

  if (variants && variants?.length > 0) {
    formData.append("variants", JSON.stringify(variants));
  }

  if (discountStartDate) {
    const newDate = new Date(discountStartDate).toISOString();
    formData.append("discountStartDate", newDate);
  }

  if (discountEndDate) {
    const newDate = new Date(discountEndDate).toISOString();
    formData.append("discountEndDate", newDate);
  }

  if (others) {
    Object.entries(others).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return axios.post(`/product/create`, formData);
};

export const editProduct = (
  id,
  { images, addedImages, removedImages, attributes, variants, ...others },
) => {
  const formData = new FormData();

  if (addedImages && addedImages?.length > 0) {
    addedImages.forEach((image) => {
      formData.append("addedImages", image);
    });
  }

  if (removedImages && removedImages?.length > 0) {
    formData.append("removedImages", JSON.stringify(removedImages));
  }

  if (attributes) {
    formData.append("attributes", JSON.stringify(attributes));
  }

  if (variants) {
    formData.append("variants", JSON.stringify(variants));
  }

  if (others) {
    Object.entries(others).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return axios.put(`/product/edit/${id}`, formData);
};

export const getProductsForAdmin = (search, page, limit, status, sort) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (status) params.append("status", status);
  if (sort) params.append("sort", sort);

  return axios.get(`/product/get-for-admin?${params.toString()}`);
};

export const getProductByID = (id) => {
  return axios.get(`/product/get/${id}`);
};
