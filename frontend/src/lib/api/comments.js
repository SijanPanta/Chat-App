import api from "./client";

export async function getCommentsbyPost(postId, page = 1) {
  const response = await api.get(
    `/api/posts/comments/${postId}?page=${page}&limit=5`,
  );
  return response;
}

export async function postComment(postId, content) {
  const response = await api.post(`/api/posts/comments/${postId}`, { content });
  return response;
}

export async function deleteCommentById(commentId, postId) {
  const response = await api.delete(
    `/api/posts/comments/${commentId}?${postId}`,
  );
  return response;
}
