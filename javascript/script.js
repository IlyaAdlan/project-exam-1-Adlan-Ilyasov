import { initCarousel } from "./carousel.js";
import { fetchPosts } from "./fetchPosts.js";
import { registerUser } from "./register.js";
import { loginUser, initializeLoginForm } from "./login.js";
import { createPost, deletePost } from "./apiHandler.js";

let currentPage = 1;
const postsContainer = document.getElementById("post-grid");
let token = localStorage.getItem("token");

async function handleDelete(event) {
  const postId = event.target.dataset.id;

  if (confirm("Are you sure you want to delete this post?")) {
    const token = localStorage.getItem("token");
    const response = await deletePost(token, postId);
    if (response) {
      showToast("Post deleted successfully!");
      loadPosts();
    } else {
      showToast("Failed to delete post.");
    }
  }
}

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

      // Post Link and Image
      const postLink = document.createElement("a");
      postLink.href = `post/post.html?id=${post.id}`;
      postLink.classList.add("post-link");

      const postImage = document.createElement("img");
      postImage.src = post.media?.url || "placeholder.jpg";
      postImage.alt = "Post image";
      postImage.classList.add("post-image");

      postLink.appendChild(postImage);
      postElement.appendChild(postLink);

      // Post Title
      const title = document.createElement("h3");
      title.innerText = post.title;

      // Author and Publication Date
      const author = post.author?.name || "Unknown Author";
      const pubDate = new Date(post.created).toLocaleDateString();

      const authorElement = document.createElement("p");
      authorElement.innerText = `Author: ${author}`;

      const pubDateElement = document.createElement("p");
      pubDateElement.innerText = `Published on: ${pubDate}`;

      postElement.appendChild(title);
      postElement.appendChild(authorElement);
      postElement.appendChild(pubDateElement);

      if (token && window.location.pathname.includes("/post/edit.html")) {
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

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".carousel-container")) {
    initCarousel(token);
  }

  const editButton = document.getElementById("edit-button");
  if (editButton) {
    editButton.addEventListener("click", () => {
      const token = localStorage.getItem("token");
      if (token) {
        window.location.href = "/post/edit.html";
      } else {
        alert("You need to be logged in to edit posts.");
        window.location.href = "login.html";
      }
    });
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

document
  .getElementById("register-form")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    await registerUser(name, email, password);
  });
