export async function fetchPosts(token, currentPage) {
  const name = localStorage.getItem("");
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${name}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      renderPosts(data.data);
    } else {
      console.error("Failed to fetch blog posts:", data.message);
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
}

function renderPosts(posts) {
  const postGrid = document.getElementById("post-grid");
  postGrid.innerHTML = "";
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
}

function updateWheel(meta) {
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const currentPageSpan = document.getElementById("current-page");

  prevPageButton.disabled = !meta.previousPage;
  nextPageButton.disabled = !meta.nextPage;

  currentPageSpan.textContent = `Page ${meta.currentPage}`;
}
