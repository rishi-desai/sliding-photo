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
  const newImages = imagePairs[currentImageIndex];
  document.querySelector("#image-comparison-slider img:first-child").src =
    newImages.left;
  document.querySelector("#image-comparison-slider .img-wrapper img").src =
    newImages.right;
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

let startX;
let startY;
let distX;
let threshold = 150; // Required min distance traveled to be considered swipe
let restraint = 100; // Maximum distance allowed at the same time in perpendicular direction
let allowedTime = 200; // Maximum time allowed to travel that distance
let elapsedTime;
let startTime;

const swipeDetectionArea = document.getElementById("swipe-detection-area");

function swipeStart(e) {
  let touchObj = e.changedTouches[0];
  startX = touchObj.pageX;
  startY = touchObj.pageY;
  startTime = new Date().getTime(); // Record time when finger first makes contact with surface
  e.preventDefault();
}

function swipeMove(e) {
  e.preventDefault(); // Prevent scrolling when inside DIV
}

function swipeEnd(e) {
  let touchObj = e.changedTouches[0];
  distX = touchObj.pageX - startX; // Get horizontal distance traveled by finger while in contact with surface
  let distY = touchObj.pageY - startY; // Get vertical distance traveled by finger while in contact with surface
  elapsedTime = new Date().getTime() - startTime; // Get time elapsed
  if (elapsedTime <= allowedTime) {
    // First condition for awipe met
    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
      // 2nd condition for horizontal swipe met
      swipeDirection(distX); // if dist traveled is negative, it indicates left swipe
    }
  }
  e.preventDefault();
}

function swipeDirection(distX) {
  if (distX < 0) {
    console.log("Swipe Left");
    // Handle left swipe
    swapImages("left");
  } else {
    console.log("Swipe Right");
    // Handle right swipe
    swapImages("right");
  }
}

swipeDetectionArea.addEventListener("touchstart", swipeStart, false);
swipeDetectionArea.addEventListener("touchmove", swipeMove, false);
swipeDetectionArea.addEventListener("touchend", swipeEnd, false);
