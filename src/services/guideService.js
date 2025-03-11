import axios from "@/configs/axios";

export const createNewPicnicGuide = ({
  userID,
  title,
  summary,
  image,
  content,
}) => {
  const formData = new FormData();
  formData.append("userID", userID);
  formData.append("title", title);
  formData.append("summary", summary);
  formData.append("image", image);
  formData.append("content", content);

  return axios.post("/picnic-guide/create", formData);
};

export const getPicnicGuides = ({ status, search, sort, page, limit }) => {
  return axios.get(`/picnic-guide/get-for-admin`, {
    params: { status, search, sort, page, limit },
  });
};

export const changePublisedStatus = (id, isPublished) => {
  return axios.put(`/picnic-guide/change-status/${id}`, { isPublished });
};

export const deleteGuide = (id) => {
  return axios.delete(`/picnic-guide/delete/${id}`);
};

export const editGuide = (id, { title, summary, image, content }) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("summary", summary);
  formData.append("image", image);
  formData.append("content", content);

  return axios.put(`/picnic-guide/edit/${id}`, formData);
};

export const getGuideBySlug = (slug) => {
  return axios.get(`/picnic-guide/get-details/${slug}`);
};
