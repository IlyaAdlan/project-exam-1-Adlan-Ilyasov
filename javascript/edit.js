import { createPost, editPost } from "./apiHandler.js";
import { showToast } from "./script.js";

// Handle the creation of a new post
document
  .getElementById("post-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page reload

    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;
    const media = document.getElementById("post-media").value;

    const post = {
      title,
      body,
      media: { url: media },
    };

    const token = localStorage.getItem("token");
    if (token) {
      const response = await createPost(token, post);
      if (response) {
        showToast("Post created successfully!");
        window.location.href = "../index.html"; // Redirect after creation
      } else {
        showToast("Failed to create post.");
      }
    } else {
      alert("You need to be logged in to create posts.");
      window.location.href = "../login.html";
    }
  });

// Edit post functionality
document.addEventListener("click", (event) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to be logged in to edit posts.");
    window.location.href = "../login.html";
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

// Handle post update
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
        location.reload(); // Optionally, refresh the page
      } else {
        showToast("Failed to update post.");
      }
    }
  });
}

// Close edit modal
const closeModal = document.getElementById("close-modal");
if (closeModal) {
  closeModal.addEventListener("click", () => {
    const modal = document.getElementById("edit-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
  });
}
