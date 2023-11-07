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
