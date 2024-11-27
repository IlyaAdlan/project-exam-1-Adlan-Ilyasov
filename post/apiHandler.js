const API_BASE_URL = "https://v2.api.noroff.dev/";

async function apiRequest(endpoint, method = "GET", token = null, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }), // Add body only if provided
  };

  try {
    console.log("Requesting:", `${API_BASE_URL}${endpoint}`, options);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || "Something went wrong");
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error(`Error with ${method} request to ${endpoint}:`, error);
    return null;
  }
}

export async function createPost(token, post) {
  return await apiRequest("", "POST", token, post);
}

export async function editPost(token, postId, updatedPost) {
  return await apiRequest(`/${postId}`, "PUT", token, updatedPost);
}

export async function deletePost(token, postId) {
  return await apiRequest(`/${postId}`, "DELETE", token);
}

export async function getPosts(token) {
  return await apiRequest("", "GET", token);
}
