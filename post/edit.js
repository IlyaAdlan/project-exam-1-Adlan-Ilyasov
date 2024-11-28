import { editPost } from "./apiHandler.js";

// Open Edit Modal
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-post")) {
    const postId = event.target.dataset.id;

    // Fetch post data (optional, if already available on the page)
    const postElement = event.target.closest(".post-item");
    const currentTitle = postElement.querySelector("h3").textContent;
    const currentBody = postElement.querySelector("p").textContent;
    const currentMedia = postElement.querySelector("img").src;

    // Populate the modal
    document.getElementById("edit-title").value = currentTitle;
    document.getElementById("edit-body").value = currentBody;
    document.getElementById("edit-media").value = currentMedia;
    document.getElementById("edit-modal").dataset.postId = postId;

    // Show the modal
    document.getElementById("edit-modal").classList.remove("hidden");
  }
});

// Handle Form Submission
document
  .getElementById("edit-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const postId = document.getElementById("edit-modal").dataset.postId;

    const updatedPost = {
      title: document.getElementById("edit-title").value,
      body: document.getElementById("edit-body").value,
      media: { url: document.getElementById("edit-media").value },
    };

    const token = localStorage.getItem("token");
    const response = await editPost(token, postId, updatedPost);

    if (response) {
      alert("Post updated successfully!");
      loadPosts(); // Refresh the posts
      document.getElementById("edit-modal").classList.add("hidden");
    } else {
      alert("Failed to update post.");
    }
  });

// Close Modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("edit-modal").classList.add("hidden");
});
