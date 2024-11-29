import { initCarousel } from "./account/carousel.js";
import { fetchPosts } from "./account/fetchPosts.js";
import { registerUser } from "./account/register.js";
import { loginUser, initializeLoginForm } from "./account/login.js";
import {
  createPost,
  editPost,
  deletePost,
  getPosts,
} from "./post/apiHandler.js";

let currentPage = 1;
const postsContainer = document.getElementById("post-grid");
let token = localStorage.getItem("token");

// Function to load posts
async function loadPosts() {
  const postsGrid = document.getElementById("post-grid");
  if (!postsGrid) return;

  postsGrid.innerHTML = "<p>Loading...</p>";
  const postsData = await fetchPosts(token, currentPage);

  if (postsData && postsData.data) {
    postsGrid.innerHTML = ""; // Clear loading message
    postsData.data.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post-item");

      postElement.innerHTML = `
        <img src="${
          post.media?.url || "placeholder.jpg"
        }" alt="Post image" class="post-image" />
        <h3>${post.title}</h3>
        <p>${post.body.slice(0, 100)}...</p>
        ${
          window.location.pathname.includes("edit.html")
            ? `<div class="post-buttons">
                 <button class="edit-button" data-id="${post.id}">Edit</button>
                 <button class="delete-button" data-id="${post.id}">Delete</button>
               </div>`
            : `<a href="post.html?id=${post.id}" class="read-more-button">Read More</a>`
        }
      `;

      postsGrid.appendChild(postElement);
    });
  } else {
    postsGrid.innerHTML = "<p>No posts found.</p>";
  }
}

// Handle post creation
async function handlePostCreation(event) {
  event.preventDefault();
  const title = document.getElementById("post-title").value;
  const body = document.getElementById("post-body").value;
  const media = document.getElementById("post-media").value;

  const newPost = {
    title,
    body,
    media: media ? { url: media } : undefined,
  };

  const response = await createPost(token, newPost);
  if (response) {
    alert("Post created successfully!");
    document.getElementById("post-form").reset(); // Clear the form
    loadPosts();
  } else {
    alert("Failed to create post.");
  }
}

async function handleEdit(event) {
  const postId = event.target.dataset.id;
  const title = prompt("Enter new title:");
  const body = prompt("Enter new body:");
  const mediaUrl = prompt("Enter new media URL:");

  if (!title || !body) {
    alert("Both title and body are required.");
    return;
  }

  const updatedPost = {
    title,
    body,
    media: mediaUrl ? { url: mediaUrl } : undefined,
  };

  const response = await editPost(token, postId, updatedPost);
  if (response) {
    alert("Post updated successfully!");
    loadPosts();
  } else {
    alert("Failed to update post.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  initCarousel(token);
});

// Handle deleting a post
async function handleDelete(event) {
  const postId = event.target.dataset.id;

  if (confirm("Are you sure you want to delete this post?")) {
    const response = await deletePost(token, postId);
    if (response) {
      alert("Post deleted successfully!");
      loadPosts();
    } else {
      alert("Failed to delete post.");
    }
  }
}

// Pagination controls
document.addEventListener("DOMContentLoaded", () => {
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

  loadPosts(); // Initial load
});

// Attach create post functionality
const postForm = document.getElementById("post-form");
if (postForm) {
  postForm.addEventListener("submit", handlePostCreation);
}

document.addEventListener("DOMContentLoaded", () => {
  initializeLoginForm(); // Initialize the login form logic
});
