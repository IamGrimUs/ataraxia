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
    per_page: 15
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

//add the images into the html for slideshow display
function appendHTMLElement(backgroundImage, portfolioUrl, firstName, lastName) {
  console.log("appending li...");
  let imageBlock = `<li class="slideshow-image--hide js-slideshowFrame">
            <span style="background-image: url(${backgroundImage})"></span>
            <div class="photo-info-frame">
              <p class="photographer-info"><a href="${portfolioUrl}"><i class="fa fa-camera-retro" id="camera-icon" aria-hidden="true"></i> by ${firstName} ${lastName}</a></p>
              <p class="disclaimer">provided by unsplash</p>
            </div>
            <blockquote cite="https://forismatic.com/en/">
              <p class="quote-frame js-quote-frame">" "</p>
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
    callForinsmaticApi();
  }
  hidePreloader();
}

function hidePreloader() {
  console.log("hidding...");
  $(".spinner-wrapper").addClass("hide-preloader");
}

// https://api.jquery.com/jquery.getjson/#jsonp
function callForinsmaticApi() {
  console.log("calling forinsmatic...");
  $.getJSON(
    "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?"
  ).done(saveForismaticApiData);
}
function saveForismaticApiData(response) {
  // $('#log').prepend('<pre>' + $('#response').html() + '</pre>');
  // $('#response').html(JSON.stringify(response));
  console.log(response);
  let quoteText = response.quoteText;
  let quoteAuthor = response.quoteAuthor;
  diplayQuote(quoteText, quoteAuthor);
}

function diplayQuote(quoteText, quoteAuthor) {
  console.log("displaying quote...");
  $(".js-quote-frame").text(quoteText);
  $(".js-quote-author-frame").text(quoteAuthor);
}

function menuClick() {
  $(".pulse").click(function() {
    $(".site-message-frame").toggleClass("hidden-message");
    $(".photo-info-frame p").toggleClass("hide-me");
    $(".js-slideshowFrame blockquote").toggleClass("hide-me");
  });
}

function askToRemoveQuotes() {
  $("#removeQuote").val($(this).is(":checked"));

  $("#removeQuote").change(function() {
    if ($(this).is(":checked")) {
      $(this).attr("checked", hideQuote);
    } else {
      $(this).attr("checked", displayQuote);
    }
    $("#removeQuote").val($(this).is(":checked"));
  });
}

function askToRemovePhotographer() {
  $("#removePhotographer").val($(this).is(":checked"));

  $("#removePhotographer").change(function() {
    if ($(this).is(":checked")) {
      $(this).attr("checked", hidePhotographer);
    } else {
      $(this).attr("checked", displayPhotographer);
    }
    $("#removePhotographer").val($(this).is(":checked"));
  });
}

function hideQuote() {
  $(".js-slideshowFrame blockquote").removeClass("reveal-for-good");
  $(".js-slideshowFrame blockquote").addClass("hidden-for-good");
}

function displayQuote() {
  $(".js-slideshowFrame blockquote").removeClass("hidden-for-good");
  $(".js-slideshowFrame blockquote").addClass("reveal-for-good");
}

function hidePhotographer() {
  $(".photo-info-frame p").removeClass("reveal-for-good");
  $(".photo-info-frame p").addClass("hidden-for-good");
}

function displayPhotographer() {
  $(".photo-info-frame p").removeClass("hidden-for-good");
  $(".photo-info-frame p").addClass("reveal-for-good");
}

$(function() {
  callUnsplashAPI();
  menuClick();
  askToRemoveQuotes();
  askToRemovePhotographer();
});
