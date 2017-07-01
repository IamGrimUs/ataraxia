const BASE_URL = "https://api.unsplash.com/";
const ID_STR =
  "client_id=cc682cb24c6d39c5f80d0e5b0703f516c2ce7e7a4c5028787549cc061e8b8880";
const COLLECTIONS_URL = BASE_URL + "/collections/960351/photos/?" + ID_STR;
const STATE = {
  images: []
};

//capture the image object properties and display them in the html
function showContent() {
  const state = STATE;
  for (var image of state.images) {
    let backgroundImage = image.urls.full;
    let firstName = image.user.first_name;
    let lastName = image.user.last_name;
    let locationName = _.get(image, "details.location.name", "");
    let locationCity = _.get(image, "details.location.city", "");
    let locationCountry = _.get(image, "details.location.country", "");
    let renderMe = `<li>
                      <span style="background-image: url(${backgroundImage})"></span>
                      <div>
                        <h3>${firstName} ${lastName}</h3>
                        <p>${locationName} ${locationCity} ${locationCountry}</p>
                      </div>
                    </li>`;
    $(".cb-slideshow").append(renderMe);
  }
}

//use getJSON call to the unsplash API requesting a collection of images
function getImages() {
  let query = {
    per_page: 2
  };
  $.getJSON(COLLECTIONS_URL, query).then(saveData);
}

//initial callback function populates the array of returned images, the photographers name & the photo IDs
function saveData(data) {
  STATE.images.push(...data);
  getDetails(STATE);
  // saveDetails(STATE, MORE_INFO);
}

//pass the unique photo id tags back to the api and request more detailed inform ation
function getDetails(state) {
  const promises = [];
  for (let i = 0; i < state.images.length; i++) {
    let PHOTO_URL = BASE_URL + "photos/" + state.images[i].id + "/?" + ID_STR;
    const saveDetailsPromise = $.getJSON(PHOTO_URL).then(saveDetails);
    promises.push(saveDetailsPromise);
  }
  Promise.all(promises).then(showContent);
}

//match the id property in STATE.images to id property contained in the data array
function saveDetails(data) {
  const state = STATE;
  for (let i = 0; i < data.length; i++) {
    let imgMatch = state.images.find(function(image, index) {
      return image.id === data[i].id;
    });
    imgMatch.details = data[i];
  }
  //showContent(state);
}

// // function Slideshow( element ) {
// //     this.el = document.querySelector( element );
// //     this.init();
// //   }

// //   Slideshow.prototype = {
// //     init: function() {
// //       this.wrapper = this.el.querySelector( ".slider-wrapper" );
// //       this.slides = this.el.querySelectorAll( ".slide" );
// //       this.previous = this.el.querySelector( ".slider-previous" );
// //       this.next = this.el.querySelector( ".slider-next" );
// //       this.index = 0;
// //       this.total = this.slides.length;
// //       this.timer = null;

// //       this.action();
// //       this.stopStart();
// //     },
// //     _slideTo: function( slide ) {
// //       var currentSlide = this.slides[slide];
// //       currentSlide.style.opacity = 1;

// //       for( var i = 0; i < this.slides.length; i++ ) {
// //         var slide = this.slides[i];
// //         if( slide !== currentSlide ) {
// //           slide.style.opacity = 0;
// //         }
// //       }
// //     },
// //     action: function() {
// //       var self = this;
// //               self.timer = setInterval(function() {
// //         self.index++;
// //         if( self.index == self.slides.length ) {
// //           self.index = 0;
// //         }
// //         self._slideTo( self.index );

// //       }, 60000);
// //     },
// //     stopStart: function() {
// //       var self = this;
// //       self.el.addEventListener( "mouseover", function() {
// //         clearInterval( self.timer );
// //         self.timer = null;

// //       }, false);
// //       self.el.addEventListener( "mouseout", function() {
// //         self.action();

// //       }, false);
// //     }

// //   };

//   document.addEventListener( "DOMContentLoaded", function() {

//     var slider = new Slideshow( "#main-slider" );

//   });
// });

$(function() {
  getImages();
  // saveData(PHOTO_DATA);
});
