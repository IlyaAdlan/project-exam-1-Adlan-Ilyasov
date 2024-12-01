import { editPost } from "./apiHandler.js";
import { showToast } from "../script.js";

document.addEventListener("click", (event) => {
  const token = localStorage.getItem("token");

  // Check if the user is logged in
  if (!token) {
    alert("You need to be logged in to edit posts.");
    window.location.href = "/login-register/login.html"; // Redirect to login page
    return;
  }

  if (event.target.classList.contains("edit-post")) {
    const postId = event.target.dataset.id;
    const postElement = event.target.closest(".post-item");
    if (!postElement) return;

    const currentTitle = postElement.querySelector("h3")?.textContent || "";
    const currentBody = postElement.querySelector("p")?.textContent || "";
    const currentMedia = postElement.querySelector("img")?.src || "";

    const titleInput = document.getElementById("edit-title");
    const bodyInput = document.getElementById("edit-body");
    const mediaInput = document.getElementById("edit-media");
    const modal = document.getElementById("edit-modal");

    if (titleInput && bodyInput && mediaInput && modal) {
      titleInput.value = currentTitle;
      bodyInput.value = currentBody;
      mediaInput.value = currentMedia;
      modal.dataset.postId = postId;

      modal.classList.remove("hidden");
    }
  }
});

const editForm = document.getElementById("edit-form");
if (editForm) {
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const modal = document.getElementById("edit-modal");
    if (!modal) return;

    const postId = modal.dataset.postId;
    const titleInput = document.getElementById("edit-title");
    const bodyInput = document.getElementById("edit-body");
    const mediaInput = document.getElementById("edit-media");

    if (titleInput && bodyInput && mediaInput) {
      const updatedPost = {
        title: titleInput.value,
        body: bodyInput.value,
        media: { url: mediaInput.value },
      };

      const token = localStorage.getItem("token");
      const response = await editPost(token, postId, updatedPost);

      if (response) {
        showToast("Post updated successfully!");
        modal.classList.add("hidden");
        location.reload(); // Refresh the page after successful update
      } else {
        showToast("Failed to update post.");
      }
    }
  });
}

const closeModal = document.getElementById("close-modal");
if (closeModal) {
  closeModal.addEventListener("click", () => {
    const modal = document.getElementById("edit-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
  });
}
