import { fetchPosts } from "./fetchPosts.js";

export async function initCarousel(token) {
  const carousel = document.querySelector(".carousel-container");
  const carouselContent = carousel.querySelector("#carousel-content");

  let currentIndex = 0;

  const postsData = await fetchPosts(token, 1);
  const posts = postsData?.data.slice(0, 3);

  if (posts) {
    posts.forEach((post) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      carouselItem.innerHTML = `
        <img src="${post.media?.url || "placeholder.jpg"}" alt="${post.title}">
        <h3>${post.title}</h3>
        
      `;
      carouselContent.appendChild(carouselItem);
    });
  }

  function moveToNext() {
    if (currentIndex < posts.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarouselPosition();
  }

  function moveToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = posts.length - 1;
    }
    updateCarouselPosition();
  }

  function updateCarouselPosition() {
    const offset = -currentIndex * 100;
    carouselContent.style.transform = `translateX(${offset}%)`;
  }

  const prevButton = carousel.querySelector("#prev-btn");
  const nextButton = carousel.querySelector("#next-btn");

  prevButton.addEventListener("click", moveToPrev);
  nextButton.addEventListener("click", moveToNext);

  setInterval(moveToNext, 3000);
}
