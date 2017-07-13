const BASE_URL = "https://api.unsplash.com/";
const ID_STR =
  "client_id=cc682cb24c6d39c5f80d0e5b0703f516c2ce7e7a4c5028787549cc061e8b8880";
const COLLECTIONS_URL = BASE_URL + "/collections/960351/photos/?" + ID_STR;
const STATE = {
  images: []
};

function welcomeMessageAction() {
  $(".start-button").click(function() {
    $(".site-message-frame").addClass("hidden-message");
    $(".start-button").addClass("hidden-message");
  });
}

function renderLoadingScreen() {
  let welcomeHtml = `<div class="spinner-wrapper">
                      <h1>Ataraxia</h1>
                      <div class="spinner">
                        <div class="dot1"></div>
                        <div class="dot2"></div>
                      </div>
                    </div>`;
  $("main").prepend(welcomeHtml);
}

//use getJSON call to the unsplash API requesting a collection of images
function callUnsplashAPI() {
  let query = {
    per_page: 3
  };
  $.getJSON(COLLECTIONS_URL, query)
    .then(saveUnsplashApiData)
    .then(shuffleImageArray)
    .then(saveApiObjectProperties)
    .then(renderImages);
}

//initial callback function populates the array of returned images, the photographers name & the photo IDs
function saveUnsplashApiData(data) {
  STATE.images.push(...data);
  // console.log("STATE.images:");
  // console.log(STATE.images);
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
  // console.log("showing content...");
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

//add the images into the html for slideshow display
function appendHTMLElement(backgroundImage, portfolioUrl, firstName, lastName) {
  // console.log("appending li...");
  let imageBlock = `<li class="slideshow-image--hide js-slideshowFrame">
            <span style="background-image: url(${backgroundImage})"></span>
            <div class="photo-info-frame">
              <p class="photographer-info"><a href="${portfolioUrl}"><i class="fa fa-camera-retro" id="camera-icon" aria-hidden="true"></i> by ${firstName} ${lastName}</a></p>
            </div>
            <blockquote cite="https://forismatic.com/en/">
              <p class="quote-frame js-quote-frame"></p>
              <p class="quote-author-frame js-quote-author-frame"></p>
            </blockquote>
          </li>`;
  $(".slideshow").append(imageBlock);
}

function renderImages() {
  cacheFirstImage(displayImageSlideShow);
}

function cacheFirstImage(callback) {
  let image = new Image();
  image.onload = function() {
    callback();
  };
  image.src = STATE.images[0].urls.full;
}

function displayImageSlideShow() {
  let slideIndex = 0;
  let slides = $(".js-slideshowFrame");
  // console.log(Array.isArray(slides));
  showSlides();
  hidePreloader();
  menuIconleftArrowAction(slideIndex);
  menuIconRightArrowAction(slideIndex);

  function showSlides() {
    for (let i = 0; i < slides.length; i++) {
      $(slides[i]).addClass("slideshow-image--hide");
      $(slides[i]).removeClass("slideshow-image--reveal");
    }
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 0;
    }
    $(slides[slideIndex - 1]).addClass("slideshow-image--reveal");
    $(slides[slideIndex - 1]).removeClass("slideshow-image--hide");
    callForinsmaticApi();
    setTimeout(showSlides, 8000); // Change image every 90 seconds
  }
}

function menuIconleftArrowAction(slides, currentImage) {
  $("#js-prevImageArrow").click(function() {
    console.log("prev image please");
    console.log(currentImage);
    $(slides[currentImage - 1]).removeClass("slideshow-image--hide");
    $(slides[currentImage - 1]).addClass("slideshow-image--reveal");
    $(slides[currentImage]).removeClass("slideshow-image--reveal");
    $(slides[currentImage]).addClass("slideshow-image--hide");
  });
}

function menuIconRightArrowAction(slides, currentImage) {
  $("#js-nextImageArrow").click(function() {
    console.log("next image please");
    console.log(currentImage);
    $(slides[currentImage + 1]).removeClass("slideshow-image--hide");
    $(slides[currentImage + 1]).addClass("slideshow-image--reveal");
    $(slides[currentImage]).removeClass("slideshow-image--reveal");
    $(slides[currentImage]).addClass("slideshow-image--hide");
  });
}

function hidePreloader() {
  // console.log("hidding...");
  $(".spinner-wrapper").addClass("hide-preloader");
}

function callForinsmaticApi() {
  // console.log("calling forinsmatic...");
  $.getJSON(
    "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?"
  ).done(saveForismaticApiData);
}

function saveForismaticApiData(response) {
  // console.log(response);
  let quoteText = response.quoteText;
  let quoteAuthor = response.quoteAuthor;
  diplayQuote(quoteText, quoteAuthor);
}

function diplayQuote(quoteText, quoteAuthor) {
  if (quoteText.length > 64) {
    callForinsmaticApi();
  } else {
    $(".js-quote-frame").text(quoteText);
    $(".js-quote-author-frame").text(quoteAuthor);
  }
}

function menuIconSettingAction(event) {
  $(".menu-icon--settings").click(function(event) {
    event.preventDefault();
    $(".site-message-frame").toggleClass("hidden-message");
    $(".menu-icon--camera").toggleClass("hide-me");
    $(".menu-icon--quote").toggleClass("hide-me");
    $(".menu-icon--prevImage").toggleClass("hide-me");
    $(".menu-icon--nextImage").toggleClass("hide-me");
    $(".photo-info-frame").toggleClass("hide-me-important");
    $(".js-slideshowFrame blockquote").toggleClass("hide-me-important");
    $(".menu-frame").toggleClass("top-icon").addClass("behind-menu-icons");
    // hidePreloader();
  });
}

function menuIconQuoteAction() {
  $(".menu-icon--quote").click(function() {
    // console.log("you clicked the quote");
    $(".menu-icon--quote").toggleClass("red-icon");
    showOrHideQuote();
  });
}

function showOrHideQuote() {
  let isIconRed = $(".menu-icon--quote").hasClass("red-icon");
  if (isIconRed) {
    $("blockquote").removeClass("reveal-me");
    $("blockquote").addClass("hide-me");
  } else {
    $("blockquote").removeClass("hide-me");
    $("blockquote").addClass("reveal-me");
  }
}

function menuIconCameraAction() {
  $(".menu-icon--camera").click(function() {
    $(".menu-icon--camera").toggleClass("red-icon");
    showOrHidePhotographer();
  });
}

function showOrHidePhotographer() {
  let isIconRed = $(".menu-icon--camera").hasClass("red-icon");
  if (isIconRed) {
    $(".photo-info-frame").removeClass("reveal-me");
    $(".photo-info-frame").addClass("hide-me");
  } else {
    $(".photo-info-frame").removeClass("hide-me");
    $(".photo-info-frame").addClass("reveal-me");
  }
}

$(function() {
  renderLoadingScreen();
  welcomeMessageAction();
  callUnsplashAPI();
  menuIconSettingAction();
  menuIconQuoteAction();
  menuIconCameraAction();
});
