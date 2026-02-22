import api from "./client";

export async function getAllPosts(page, limit) {
  const response = await api.get(`/api/posts/?page=${page}&limit=${limit}`);
  return response.data;
}

export async function getUserPosts(userId, page, limit) {
  const response = await api.get(
    `/api/posts/users/${userId}?page=${page}&limit=${limit}`,
  );
  return response.data;
}

export async function createPost(formData) {
  const response = await api.post("/api/posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deletePost(postId) {
  const response = await api.delete(`/api/posts/${postId}`);
  return response.data;
}

export async function toggleLike(postId) {
  const response = await api.post(`/api/posts/${postId}/like`);
  return response;
}
