// Import necessary modules
import { initCarousel } from "./account/carousel.js";
import { fetchPosts } from "./account/fetchPosts.js";
import { registerUser } from "./account/register.js";
import { loginUser, initializeLoginForm } from "./account/login.js";
import { createPost, deletePost } from "./post/apiHandler.js";

let currentPage = 1;
const postsContainer = document.getElementById("post-grid");
let token = localStorage.getItem("token");

// Function to handle post deletion
async function handleDelete(event) {
  const postId = event.target.dataset.id;

  if (confirm("Are you sure you want to delete this post?")) {
    const token = localStorage.getItem("token");
    const response = await deletePost(token, postId);
    if (response) {
      showToast("Post deleted successfully!");
      loadPosts(); // Reload the posts after deletion
    } else {
      showToast("Failed to delete post.");
    }
  }
}

// Function to load posts
async function loadPosts() {
  const postsGrid = document.getElementById("post-grid");
  if (!postsGrid) return;

  postsGrid.innerHTML = "<p>Loading...</p>";
  const postsData = await fetchPosts(token, currentPage);

  if (postsData && postsData.data) {
    postsGrid.innerHTML = "";
    postsData.data.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post-item");

      const postLink = document.createElement("a");
      postLink.href = `/post/post.html?id=${post.id}`;
      postLink.classList.add("post-link");

      const postImage = document.createElement("img");
      postImage.src = post.media?.url || "placeholder.jpg";
      postImage.alt = "Post image";
      postImage.classList.add("post-image");

      postLink.appendChild(postImage);
      postElement.appendChild(postLink);

      const title = document.createElement("h3");
      title.innerText = post.title;

      postElement.appendChild(title);

      // Check if user is logged in before showing edit/delete buttons
      if (token && window.location.pathname.includes("edit.html")) {
        const buttons = document.createElement("div");
        buttons.classList.add("post-buttons");
        buttons.innerHTML = `
          <button class="edit-post" data-id="${post.id}">Edit</button>
          <button class="delete-post" data-id="${post.id}">Delete</button>
        `;
        postElement.appendChild(buttons);

        buttons
          .querySelector(".delete-post")
          .addEventListener("click", handleDelete);
      }

      postsGrid.appendChild(postElement);
    });
  } else {
    postsGrid.innerHTML = "<p>No posts found.</p>";
  }
}

// Toast notification function
export function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerText = message;

  const toastContainer = document.getElementById("toast-container");
  if (toastContainer) {
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Event listeners for the Edit button and pagination buttons
document.addEventListener("DOMContentLoaded", () => {
  // Initialize carousel if present
  if (document.querySelector(".carousel-container")) {
    initCarousel(token);
  }

  const editButton = document.getElementById("edit-button");
  if (editButton) {
    editButton.addEventListener("click", () => {
      const token = localStorage.getItem("token");
      if (token) {
        window.location.href = "/post/edit.html"; // Adjust path if necessary
      } else {
        alert("You need to be logged in to edit posts.");
        window.location.href = "/login-register/login.html";
      }
    });
  } else {
    console.error("Edit button not found.");
  }

  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");

  if (prevPageButton) {
    prevPageButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        loadPosts();
      }
    });
  }

  if (nextPageButton) {
    nextPageButton.addEventListener("click", () => {
      currentPage++;
      loadPosts();
    });
  }

  loadPosts();
  initializeLoginForm();
});

// Event listener for the registration form
document
  .getElementById("register-form")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    await registerUser(name, email, password);
  });
