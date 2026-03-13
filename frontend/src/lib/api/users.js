import api from "./client";

export async function uploadProfilePicture(userId, formData) {
  const response = await api.post(
    `/api/users/${userId}/profile-picture`,
    formData,
  );
  return response.data;
}

export async function deleteProfile(userId) {
  const response = await api.delete(`/api/users/${userId}/profile-picture`);
  return { success: true };
}

export async function changePassword(data) {
  const response = await api.put("/api/users/password/reset", data);
  return response.data;
}

export async function searchUser(query) {
  const response = await api.get(`/api/users/search-user?q=${query}`)
  return response.data;
}
