let restaurant;
let reviews;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
  //For Reviews
  fetchReviewsFromURL();
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  const imageURLOld = DBHelper.imageUrlForRestaurant(restaurant);
  //Have to change URL to Load Images according to sizes

  const imgName = imageURLOld.split('.');
  const ext = imgName[1] ? imgName[1] : "jpg"; //Getting No data about ext
  const small_1x_url = imageURLOld + '_small_1x.' + ext;
  const large_2x_url = imageURLOld + '_large_2x.' + ext;

  //Applying it to image source
  image.src = large_2x_url;//Larger one initially

  image.srcset = `${small_1x_url} 300w, ${large_2x_url} 800w`;//Set src set for change of urls
  image.alt = 'Image for '+ restaurant.name + ' Restaurant';

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  var dateVal = new Date(review.updatedAt).toDateString();
  date.innerHTML = dateVal;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');

  //Changing acording to ARIA Ref: https://www.w3.org/TR/wai-aria-practices-1.1/examples/breadcrumb/index.html
  const anchorInside = document.createElement("a");
  anchorInside.href = window.location;
  anchorInside.innerHTML = restaurant.name;
  anchorInside.setAttribute("aria-current", "page");
  //Have to append this to main li tag
  li.appendChild(anchorInside);
  //append li to main breadcrumb
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//----------- Additional Method For Reviews ----------- START -----------//

/**
 * Get current restaurant from page URL.
 */
fetchReviewsFromURL = (callback) => {
  if (self.reviews) { // Reviews already fetched!
    callback(null, self.reviews)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchReviewsById(id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error("Reviews Not Available for Given Restaurant: "+error);
        return;
      }
      fillReviewsHTML();
      callback(null, self.reviews);
    });
  }
}

/**
 * Save New Restaurant Review To DB
 * Called Directly From New Review Form.
 */
saveNewReview = () => {
  //User Name for Review
  const name = document.getElementById("review-user-name").value;

  //To Get Rating From Box
  const ratingComp = document.getElementById("review-user-rating");
  const rating = ratingComp.options[ratingComp.selectedIndex].value;

  //Review Comments
  const comments = document.getElementById("review-user-text").value;

  const restaurant_id = self.restaurant.id;
  const date = Date.parse(new Date);

  //Save Restaurnat Review to Server and IndexedDB
  //If Network connection not found, save it to pending store
  DBHelper.saveReview(restaurant_id, name, rating, comments, date,
                              (error, response) => {
    if (error) {
      console.log("Problem in Network Connection, Adding review to Local store");
      showSnackBar("Internet Connection not found. \n"+
        "Review Added to local storage and will be sync once connected.");

      //This is very important for background sync event
      console.log(":: Enable background sync ::");
      navigator.serviceWorker.ready.then(function(registration) {
        registration.sync.register('syncApp').then(function() {
          console.log("Registration of it successfull");
        }, function() {
          // Registration failed
          console.log("Problem in Registration of background sync ");
        });
      });
    }
    else{
      showSnackBar("Review Added Successfully.");
    }
  });//End-saveReview

  //Append Review To Existing Form
  const ulReviewEle = document.getElementById('reviews-list');
  ulReviewEle.appendChild(createReviewHTML({restaurant_id: restaurant_id,
                                   name: name,
                                   rating: rating,
                                   comments:comments,
                                   createdAt: date,
                                   updatedAt: date}));

  //Clear Review Form after adding it
  document.getElementById("review-user-name").value = "";
  document.getElementById("review-user-rating").selected = "5";
  document.getElementById("review-user-text").value = "";
}

/**
 * Show Snackbar to User for Notification
 * Reference: https://www.w3schools.com/howto/howto_js_snackbar.asp
 */
 showSnackBar = (message) => {
     var msg = document.getElementById("snackbar");
     msg.innerHTML = message;
     msg.className = "show";
     setTimeout(function(){
        msg.className = msg.className.replace("show", "");
      }, 3000);
 }


//----------- Additional Method For Reviews ----------- END -----------//
