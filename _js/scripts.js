var UNSPLASH_URL = 'https://api.unsplash.com/collections/960351/photos/?client_id=cc682cb24c6d39c5f80d0e5b0703f516c2ce7e7a4c5028787549cc061e8b8880';

//variables that hold the menu html elements
var MENU_BUTTON = document.querySelector('.action-menu-button');
var PHOTO_CREDITS = document.querySelector('.js-content-frame');

//a series of array variables to hold specific objects returned from the API call
var imageList = [];
var firstNameList = [];
var lastNameList = [];
var photoId = [];
var locationCity = [];
var locationCountry = [];
var imageName = [];
var placeHolder = 0;

//on focus of menu button show the photographer name and photo location
$(MENU_BUTTON).focus(function() {
  PHOTO_CREDITS.classList.toggle('hidden')
  });

//on hover of menu button show the photographer name and photo location
$(MENU_BUTTON).hover(function() {
  PHOTO_CREDITS.classList.toggle('hidden')
  });

//display the photo & details on the screen
function displayContent () {
  $('.js-image-name').html(imageName[placeHolder]);
  $('.js-location-city').html(locationCity[placeHolder] + ', ' + locationCountry[placeHolder]);
  $('.js-photographer-name').html(firstNameList[placeHolder] + ' ' + lastNameList[placeHolder]);
  }

//push the unique photo information into the variable arrays
function displayIds(data) {
  imageName.push(data.location.name);
  locationCity.push(data.location.city);
  locationCountry.push(data.location.country);
  // console.log('location city is: ' + locationCity);
  // console.log('Image name is: ' + imageName);
  };

//pass the unique photo id tags back to the api and request more detailed information
function processLocation(data) {
  // console.log('This is processLocation data: ' + data);
  data.forEach(function(i){
    var UNSPLASH_ID = 'https://api.unsplash.com/photos/'+ i +'/?client_id=cc682cb24c6d39c5f80d0e5b0703f516c2ce7e7a4c5028787549cc061e8b8880';
    $.getJSON(UNSPLASH_ID).then(displayIds).then(displayContent);
    });
  };

//use getJSON call to the unsplash API requesting a collection of images
function getImage() {
  var query = {
    per_page: 2,
    }
  $.getJSON(UNSPLASH_URL, query).then(showMeData).then(processLocation).then(imageBackgroundSlideShow);
  };

//initial call back function populates the array of returned images, the photographers name & the photo IDs
function showMeData(data) {
  console.log('these are the photos returned from unsplash:');
  console.log(data);

  //use for each function to pull desired objects from unsplash and push them to the variable arrays
  data.forEach(function(i) {
    imageList.push(i.urls.full);
    firstNameList.push(i.user.first_name);
    lastNameList.push(i.user.last_name);
    photoId.push(i.id);
    });
  return photoId;
  };

//add the full url from unsplash to the background of the body tag
function imageShow() {
  console.log(imageList);
  $('body').css('background-image', `url(${imageList[placeHolder]})`);
  }

//attempt to loop through the imageList array and display each image for 15 seconds
function imageBackgroundSlideShow() {
  // console.log(imageList[0]);
  // console.log(imageList[1]);
  // imageShow()
  while (placeHolder < imageList.length -1) {
    setTimeout(imageShow, 5000);
    displayContent ();
    placeHolder++;
    console.log(placeHolder);
    }
  }

$(getImage);





