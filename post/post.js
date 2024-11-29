const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

async function fetchPostById(postId) {
  const token = localStorage.getItem("token");
  const endpoint = `blog/posts/hogne/${postId}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}

async function loadPost() {
  const postData = await fetchPostById(postId);

  if (postData) {
    document.getElementById("post-title").innerText = postData.title;
    document.getElementById("post-body").innerText = postData.body;
    if (postData.media && postData.media.url) {
      document.getElementById("post-image").src = postData.media.url;
    }
  } else {
    document.getElementById("post-container").innerHTML =
      "<p>Post not found.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPost);
