const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

console.log("Post ID:", postId);

async function fetchPostById(postId) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://v2.api.noroff.dev/blog/posts/hogne/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch the post");
    return null;
  }
  const data = await response.json();
  console.log("Fetched Post Data:", data); // Log the fetched data to ensure it's correct
  return data;
}

async function loadPost() {
  const postData = await fetchPostById(postId);

  if (postData) {
    // Log post data
    console.log("Fetched Post Data:", postData);

    // Update HTML elements with fetched post data
    document.getElementById("post-title").innerText = postData.data.title;
    document.getElementById("post-body").innerText = postData.data.body;
    document.getElementById("post-image").src =
      postData.data.media?.url || "placeholder.jpg";
    document.getElementById("post-image").alt = postData.data.title;
  } else {
    document.getElementById("post-content").innerHTML =
      "<p>Post not found.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Page Loaded");
  loadPost(); // Ensure this is called
});
