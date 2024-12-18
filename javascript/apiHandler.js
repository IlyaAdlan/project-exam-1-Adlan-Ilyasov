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
    ...(body && { body: JSON.stringify(body) }),
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
  const endpoint = "blog/posts/hogne";
  return await apiRequest(endpoint, "POST", token, post);
}

export async function editPost(token, postId, updatedPost) {
  const endpoint = `blog/posts/hogne/${postId}`;
  return await apiRequest(endpoint, "PUT", token, updatedPost);
}

export async function deletePost(token, postId) {
  const response = await fetch(
    `https://v2.api.noroff.dev/blog/posts/hogne/${postId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error deleting post:", errorData);
    throw new Error(errorData.message || "Failed to delete post.");
  }

  return true;
}

export async function getPosts(token, currentPage) {
  const username = "hogne";
  const endpoint = `blog/posts/${username}?page=${currentPage}`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch posts");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}
