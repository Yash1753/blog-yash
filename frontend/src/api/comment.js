import API from "./axios";

export const getCommentsByBlog = (blogId) =>
  API.get(`/comment/blog/${blogId}`);

export const addComment = (blogId, text) =>
  API.post(`/comment/blog/${blogId}`, { text });

export const replyToComment = (commentId, text) =>
  API.post(`/comment/${commentId}/reply`, { text });

export const deleteComment = (commentId) =>
  API.delete(`/comment/${commentId}`);

export const toggleLikeComment = (commentId) =>
  API.post(`/comment/${commentId}/like`);
