import { deletePost } from "./apiHandler.js";

export async function fetchPosts(token, currentPage) {
  const name = "hogne";
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${name}?page=${currentPage}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error("Failed to fetch blog posts:", data.message);
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
}
