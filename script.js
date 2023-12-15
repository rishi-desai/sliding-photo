const slider = document.querySelector("#image-comparison-slider");
const sliderImgWrapper = document.querySelector(
  "#image-comparison-slider .img-wrapper"
);
const sliderHandle = document.querySelector("#image-comparison-slider .handle");

slider.addEventListener("mousemove", sliderMouseMove);
slider.addEventListener("touchmove", sliderMouseMove);

function sliderMouseMove(event) {
  if (isSliderLocked) return;

  const sliderLeftX = slider.offsetLeft;
  const sliderWidth = slider.clientWidth;
  const sliderHandleWidth = sliderHandle.clientWidth;

  let mouseX = (event.clientX || event.touches[0].clientX) - sliderLeftX;
  if (mouseX < 0) mouseX = 0;
  else if (mouseX > sliderWidth) mouseX = sliderWidth;

  sliderImgWrapper.style.width = `${((1 - mouseX / sliderWidth) * 100).toFixed(
    4
  )}%`;
  sliderHandle.style.left = `calc(${((mouseX / sliderWidth) * 100).toFixed(
    4
  )}% - ${sliderHandleWidth / 2}px)`;
}

let isSliderLocked = false;

slider.addEventListener("mousedown", sliderMouseDown);
slider.addEventListener("touchstart", sliderMouseDown);
slider.addEventListener("mouseup", sliderMouseUp);
slider.addEventListener("touchend", sliderMouseUp);
slider.addEventListener("mouseleave", sliderMouseLeave);

function sliderMouseDown(event) {
  if (isSliderLocked) isSliderLocked = false;
  sliderMouseMove(event);
}

function sliderMouseUp() {
  if (!isSliderLocked) isSliderLocked = true;
}

function sliderMouseLeave() {
  if (isSliderLocked) isSliderLocked = false;
}

let currentImageIndex = 0;
const imagePairs = [
  { left: "./JPEG/Alyssa.jpg", right: "./JPEG/Alyssa(1).jpg" },
  { left: "./JPEG/Dave.jpg", right: "./JPEG/Dave(1).jpg" },
  { left: "./JPEG/Janet.jpg", right: "./JPEG/Janet(1).jpg" },
  { left: "./JPEG/Joe.jpg", right: "./JPEG/Joe(1).jpg" },
  { left: "./JPEG/Marc.jpg", right: "./JPEG/Marc(1).jpg" },
  // Add more image pairs here as needed
];

function swapImages(direction) {
  if (direction === "left") {
    currentImageIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : imagePairs.length - 1;
  } else {
    currentImageIndex =
      currentImageIndex < imagePairs.length - 1 ? currentImageIndex + 1 : 0;
  }

  // Update images
  const newImages = imagePairs[currentImageIndex];
  document.querySelector("#image-comparison-slider img:first-child").src =
    newImages.left;
  document.querySelector("#image-comparison-slider .img-wrapper img").src =
    newImages.right;

  // Synchronize herbologist index with image index
  currentHerbologist = currentImageIndex;
  updateHerbologistInfo();
}

// Array of herbologists with their names and detail page URLs
const herbologists = [
  { name: "ALYSSA SACORA | COMMON MILKWEED", url: "alyssa-sacora.html" },
  { name: "DAVE MEESTERS  | SOCHAN", url: "dave-meesters.html" },
  { name: "JANET KENT | ANGELICA TRIQUINATA", url: "janet-kent.html" },
  { name: "JOE HOLLIS | JIAO GU LAN", url: "joe-hollis.html" },
  { name: "MARC WILLIAMS | DANDELION", url: "marc-williams.html" },
  // Add more herbologists as needed
];

// Current herbologist index
let currentHerbologist = 0;

// Initial update
updateHerbologistInfo();

// Existing function to update herbologist info
function updateHerbologistInfo() {
  const herbologistNameElement = document.getElementById("herbologistName");
  herbologistNameElement.textContent = herbologists[currentHerbologist].name;
  herbologistNameElement.href = herbologists[currentHerbologist].url;
}

// Before navigating away, store the current image index
function goToHerbologistDetail() {
  localStorage.setItem("lastImageIndex", currentImageIndex);
  // Navigate to detail page logic...
}

// When the page loads, check if there's a saved index
window.onload = function () {
  const savedIndex = localStorage.getItem("lastImageIndex");
  if (savedIndex !== null) {
    currentImageIndex = parseInt(savedIndex, 10); // Convert string back to number
    swapImagesToIndex(currentImageIndex); // Function to display the image at the saved index
  }
};

// Function to swap images to a specific index
function swapImagesToIndex(index) {
  // Update images
  const newImages = imagePairs[index];
  document.querySelector("#image-comparison-slider img:first-child").src =
    newImages.left;
  document.querySelector("#image-comparison-slider .img-wrapper img").src =
    newImages.right;

  // Synchronize herbologist index with image index
  currentHerbologist = currentImageIndex;
  updateHerbologistInfo();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    swapImages(event.key === "ArrowLeft" ? "left" : "right");
  }
});

function preloadImages(imageArray) {
  imageArray.forEach((imageInfo) => {
    const img = new Image();
    img.src = imageInfo.left;
    const img2 = new Image();
    img2.src = imageInfo.right;
  });
}

// Assuming imagePairs is defined as shown previously and contains the URLs of images to be preloaded
preloadImages(imagePairs);

document.addEventListener("DOMContentLoaded", (event) => {
  const leftButton = document.getElementById("left-button");
  const rightButton = document.getElementById("right-button");

  leftButton.addEventListener("click", () => swapImages("left"));
  rightButton.addEventListener("click", () => swapImages("right"));
});
