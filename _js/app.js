const BASE_URL = "https://api.unsplash.com/";
const ID_STR =
  "client_id=cc682cb24c6d39c5f80d0e5b0703f516c2ce7e7a4c5028787549cc061e8b8880";
const COLLECTIONS_URL = BASE_URL + "/collections/960351/photos/?" + ID_STR;
const STATE = {
  images: []
};

//use getJSON call to the unsplash API requesting a collection of images
function callUnsplashAPI() {
  let query = {
    per_page: 2
  };
  $.getJSON(COLLECTIONS_URL, query)
    .then(saveApiData)
    .then(shuffleImageArray)
    .then(saveApiObjectProperties)
    .then(render);
}

//initial callback function populates the array of returned images, the photographers name & the photo IDs
function saveApiData(data) {
  STATE.images.push(...data);
  console.log("STATE.images:");
  console.log(STATE.images);
  return STATE.images;
}

function shuffleImageArray(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//capture the image object properties and display them in the html
function saveApiObjectProperties() {
  console.log("showing content...");
  const state = STATE;
  let currentIndex = 0;
  for (var image of state.images) {
    let backgroundImage = image.urls.full;
    let firstName = image.user.first_name;
    let lastName = image.user.last_name;
    let portfolioUrl = image.user.portfolio_url;
    currentIndex = currentIndex + 1;
    appendHTMLElement(backgroundImage, portfolioUrl, firstName, lastName);
  }
}

function render() {
  cacheFirstImage(displayImageSlideShow);
}

function cacheFirstImage(callback) {
  let image = new Image();
  image.onload = function() {
    callback();
  };
  image.src = STATE.images[0].urls.full;
}

function displayImageSlideShow(uniqueImageId) {
  console.log("slideshow time...");
  let slideIndex = 0;
  showSlides();
  function showSlides() {
    let slides = document.getElementsByClassName("js-slideshowFrame");
    console.log(slides[0]);
    for (let i = 0; i < slides.length; i++) {
      $(slides[i]).addClass("slideshow-image--hide");
      $(slides[i]).removeClass("slideshow-image--reveal");
    }
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    $(slides[slideIndex - 1]).addClass("slideshow-image--reveal");
    $(slides[slideIndex - 1]).removeClass("slideshow-image--hide");
    setTimeout(showSlides, 90000); // Change image every 90 seconds
  }
  hidePreloader();
}

function hidePreloader() {
  console.log("hidding...");
  $(".spinner-wrapper").addClass("hide-preloader");
}

//add the images into the html for slideshow display
function appendHTMLElement(backgroundImage, portfolioUrl, firstName, lastName) {
  console.log("appending li...");
  let imageBlock = `<li class="slideshow-image--hide js-slideshowFrame">
            <span style="background-image: url(${backgroundImage})"></span>
            <div>
            <p class="photographer-info"><a href="${portfolioUrl}"><i class="fa fa-camera-retro" id="camera-icon" aria-hidden="true"></i> by ${firstName} ${lastName}</a></p>
            <p class="disclaimer">provided by unsplash</p>
            </div>
          </li>`;
  $(".slideshow").append(imageBlock);
}

$(function() {
  callUnsplashAPI();
});
