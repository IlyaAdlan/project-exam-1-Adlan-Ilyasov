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
let token = localStorage.getItem("token");

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(
      `Inputs captured: Name: ${username}, Email: ${email}, Password: ${password}`
    );

    const result = await registerUser(username, email, password);

    if (result) {
      alert("Registration successful!");
    } else {
      alert("Registration failed. Please try again.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = await loginUser();
      if (token) {
        localStorage.setItem("token", token);
        alert("Login successful");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    });
  } else {
    console.error("Login form not found!");
  }
});

const postForm = document.getElementById("post-form");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;
    const media = document.getElementById("post-media").value;

    const newPost = { title, body, media: media ? { url: media } : undefined };
    const response = await createPost(token, newPost);
    if (response) {
      alert("Post created successfully!");
      loadPosts();
    } else {
      alert("Failed to create post.");
    }
  });
}

async function loadPosts() {
  const postsContainer = document.getElementById("posts-container");
  if (!postsContainer) return;

  postsContainer.innerHTML = "";
  const posts = await getPosts(token);
  if (posts && posts.data) {
    posts.data.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post-item");
      postElement.innerHTML = `
        <img src="${
          post.media?.url || "placeholder.jpg"
        }" alt="Post image" class="post-image" />
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <div class="post-buttons">
          <button class="edit-post" data-id="${post.id}">Edit</button>
          <button class="delete-post" data-id="${post.id}">Delete</button>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });

    document
      .querySelectorAll(".edit-post")
      .forEach((button) => button.addEventListener("click", handleEdit));
    document
      .querySelectorAll(".delete-post")
      .forEach((button) => button.addEventListener("click", handleDelete));
  } else {
    postsContainer.innerHTML = "<p>No posts found.</p>";
  }
}

async function handleEdit(e) {
  const postId = e.target.dataset.id;
  const title = prompt("Enter new title:");
  const body = prompt("Enter new body:");
  const mediaUrl = prompt("Enter new media URL:");

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

async function handleDelete(e) {
  const postId = e.target.dataset.id;

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

document.addEventListener("DOMContentLoaded", () => {
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");

  if (prevPageButton) {
    prevPageButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchPosts(token, currentPage);
      }
    });
  }

  if (nextPageButton) {
    nextPageButton.addEventListener("click", () => {
      currentPage++;
      fetchPosts(token, currentPage);
    });
  }

  loadPosts();
});

// async function main() {
//   await registerUser();
//   token = await loginUser();
//   if (token) {
//     await fetchPosts(token, currentPage);
//   }
// }

// main();
