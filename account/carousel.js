export async function initCarousel() {
  const carousel = document.querySelector(".carousel-container");
  const carouselContent = carousel.querySelector(".carousel-content");
  const items = carousel.querySelectorAll(".carousel-item");

  let currentIndex = 0;

  // Function to move the carousel to the next item
  function moveToNext() {
    if (currentIndex < items.length - 1) {
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
      currentIndex = items.length - 1; // Loop back to the last item
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

  // Optionally, you can also add auto-rotation
  setInterval(moveToNext, 3000); // Auto move every 3 seconds
}
