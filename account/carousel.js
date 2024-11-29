import { fetchPosts } from "./fetchPosts.js"; // Adjust the import path if needed

export async function initCarousel(token) {
  const carousel = document.querySelector(".carousel-container");
  const carouselContent = carousel.querySelector("#carousel-content");

  let currentIndex = 0;

  // Fetch posts dynamically
  const postsData = await fetchPosts(token, 1);
  const posts = postsData?.data.slice(0, 3); // Get the 3 latest posts

  if (posts) {
    // Populate carousel with posts
    posts.forEach((post) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      carouselItem.innerHTML = `
        <img src="${post.media?.url || "placeholder.jpg"}" alt="${post.title}">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <a href="post.html?id=${post.id}" class="read-more">Read More</a>
      `;
      carouselContent.appendChild(carouselItem);
    });
  }

  // Function to move the carousel to the next item
  function moveToNext() {
    if (currentIndex < posts.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to the first item
    }
    updateCarouselPosition();
  }

  // Function to move the carousel to the previous item
  function moveToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = posts.length - 1; // Loop back to the last item
    }
    updateCarouselPosition();
  }

  // Update the carousel content position
  function updateCarouselPosition() {
    const offset = -currentIndex * 100; // Move the content based on the current index
    carouselContent.style.transform = `translateX(${offset}%)`;
  }

  // Initialize navigation buttons
  const prevButton = carousel.querySelector("#prev-btn");
  const nextButton = carousel.querySelector("#next-btn");

  prevButton.addEventListener("click", moveToPrev);
  nextButton.addEventListener("click", moveToNext);

  // Auto-rotation (optional)
  setInterval(moveToNext, 3000);
}
