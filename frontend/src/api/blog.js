import API from "./axios";

export const getAllBlogs = (page = 1, limit = 10, search = "", tag = "") => {
  const params = { page, limit };
  if (search) params.search = search;
  if (tag) params.tag = tag;
  return API.get("/blog", { params });
};

export const getSingleBlog = (id) => API.get(`/blog/${id}`);

export const createBlog = (data) => API.post("/blog", data);

export const updateBlog = (id, data) => API.put(`/blog/${id}`, data);

export const deleteBlog = (id) => API.delete(`/blog/${id}`);

export const toggleLikeBlog = (id) => API.post(`/blog/${id}/like`);
