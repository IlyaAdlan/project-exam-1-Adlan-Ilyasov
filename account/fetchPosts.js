export async function fetchPosts(token, currentPage) {
  const name = "hogne"; // Set your username manually or get it from localStorage
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${name}?page=${currentPage}`; // Pagination

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      renderPosts(data.data, data.meta); // Make sure to pass meta for pagination
    } else {
      console.error("Failed to fetch blog posts:", data.message);
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
}

export function renderPosts(posts, meta) {
  const postGrid = document.getElementById("post-grid");
  postGrid.innerHTML = "";

  if (!posts || posts.length === 0) {
    postGrid.innerHTML = "<p>No posts available</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post-item");
    postElement.innerHTML = `
      <img src="${post.media?.url || "placeholder.jpg"}" alt="${
      post.media?.alt || "No description available"
    }">
      <h3>${post.title}</h3>
      <p>${post.body.substring(0, 100)}...</p>
    `;
    postGrid.appendChild(postElement);
  });

  updateWheel(meta);
}

function updateWheel(meta) {
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const currentPageSpan = document.getElementById("current-page");

  prevPageButton.disabled = !meta.previousPage;
  nextPageButton.disabled = !meta.nextPage;

  currentPageSpan.textContent = `Page ${meta.currentPage}`;
}
