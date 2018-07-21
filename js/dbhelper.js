/**
 * Common database helper functions.
 */
class DBHelper {

//var dbPromise = idb.open('mws_restaurants_info', 1, function(upgradeDb) {
//Not using direct variable - using static method instead
  static getRestaurantDB() {
      return idb.open('mws_restaurants_info', 3, upgradeDb => {
        //Upgrade DB if version mismatch
        switch(upgradeDb.oldVersion) {
          case 0:
            if(!upgradeDb.objectStoreNames.contains('restaurants_mst')){
              var restStore = upgradeDb.createObjectStore('restaurants_mst', { keyPath: 'id' });
            }
          case 1:
            if(!upgradeDb.objectStoreNames.contains('reviews_mst')){
              var reviewStore = upgradeDb.createObjectStore('reviews_mst', { keyPath: 'id' });
              var reviewIndexByRest = reviewStore.createIndex('group_by_restaurant', 'restaurant_id', {unique: false});
            }
          case 2:
            if(!upgradeDb.objectStoreNames.contains('pending_review_transactions')){
              var restStore = upgradeDb.createObjectStore('pending_review_transactions', { autoIncrement: true  });
            }
        }
      });
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}`;//Changed according to new server
  }

  /**
   * Get Restaurant URL.
   */
  static get RESTAURANT_URL() {
    return DBHelper.DATABASE_URL+"/restaurants";
  }

  /**
   * Creating Restaurant URL By ID.
   */
  static RESTAURANT_URL_BY_ID(id) {
    return DBHelper.RESTAURANT_URL+"/"+id;
  }

  /**
   * Creating Restaurant URL By ID.
   */
  static RESTAURANT_GET_REVIEW(id) {
    return DBHelper.DATABASE_URL+"/reviews/?restaurant_id="+id;
  }

  /**
   * Post Review For Restaurant.
   */
  static get RESTAURANT_POST_REVIEW() {
    return DBHelper.DATABASE_URL+"/reviews/";
  }

  /**
   * Fetch all restaurants.
   */
  /* static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  } */

  /**
   * Fetch all restaurants - Fetch API
   */
  static fetchRestaurants(callback) {
    let url = DBHelper.RESTAURANT_URL;
    fetch(url, { method: "GET" })
        .then(response => response.json())
        //Put All Restaurents in Store
        .then(restaurants => {
          //console.log('list of restaurents fetched '+restaurants);
          let dbPromise = DBHelper.getRestaurantDB();
          dbPromise.then(function(db) {
            if (!db) return callback(null, restaurants);
            let transaction = db.transaction('restaurants_mst', 'readwrite');
            let allRestaurents = transaction.objectStore('restaurants_mst');
            restaurants.forEach(rst => allRestaurents.put(rst));
          });
          callback(null, restaurants);
        })
        //In case of Problem in Fetching from Network
        .catch(error => {
          console.log('Getting All Restaurents From Cache Storage: '+error);
          DBHelper.getAllCachedRestaurants(null).then(allRestaurents => {
            //console.log('allRestaurents'+allRestaurents);
              if (allRestaurents.length > 0) return callback(null, allRestaurents);
            }).catch((err) => {
              console.log('Problem in getting Cached Restaurents ');
              callback(error, null);
            });
        });
  }


  /**
   * Fetch a restaurant by its ID.
   */
  /* static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  } */

  /**
   * Fetch a restaurant by its ID - Fetch API
   */
  static fetchRestaurantById(id, callback) {
    let url = DBHelper.RESTAURANT_URL_BY_ID(id);
    fetch(url, { method: "GET" })
        .then(response => response.json())
        //Put Restaurents in Store
        .then(restaurant => {
          let dbPromise = DBHelper.getRestaurantDB();
          dbPromise.then(function(db) {
            if(!db) return callback(null, restaurant);
            let transaction = db.transaction('restaurants_mst', 'readwrite');
            let allRestaurents = transaction.objectStore('restaurants_mst');
            allRestaurents.put(restaurant);
          });
          callback(null, restaurant);
        })
        //In case of Problem in Fetching from Network
        .catch(error => {
          console.log('Getting Specific Restaurant From Cache Storage');
          DBHelper.getAllCachedRestaurants(id).then(rest => {
              if (rest) return callback(null, rest);
            }).catch((err) => {
              console.log('Problem in getting Restaurent from Cache storage ');
              callback(error, null);
            });
        });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if(restaurant.photograph)
      return (`/images/${restaurant.photograph}`);
    return (`/images/${restaurant.id}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

// -------------------  DB Utility Methods ------------------- START
  /**
   * Get All Restaurents From Cache Storage .
   * One method will serve to both with and without ID requests here
   */
  static getAllCachedRestaurants(id) {
    //console.log('getAllCachedRestaurants');
    let dbPromise = DBHelper.getRestaurantDB();
    //Obtaining Result
    let res = dbPromise.then(function(db) {
      if(!db) return;
      let transaction = db.transaction('restaurants_mst');
      let allRestaurents = transaction.objectStore('restaurants_mst');
      return id!==null ? allRestaurents.get(Number(id)) : allRestaurents.getAll();
    }).catch((err) => {
      console.log('Problem in Getting All Restaurents '+err);
    });
  //Returning All Records
  //console.log('getAllCachedRestaurants'+res);
  return res;
 }

 /**
  * Fetch a Review By Restaurant ID - Fetch API
  */
 static fetchReviewsById(id, callback) {
   let url = DBHelper.RESTAURANT_GET_REVIEW(id);
   fetch(url, { method: "GET" })
       .then(response => response.json())
       //Put Reviews in Store on success
       .then(allReviews => {
         let dbPromise = DBHelper.getRestaurantDB();
         dbPromise.then(function(db) {
           if(!db) return callback(null, allReviews);
           let transaction = db.transaction('reviews_mst', 'readwrite');
           let reviewStore = transaction.objectStore('reviews_mst');
           allReviews.forEach(rev => reviewStore.put(rev));
         });
         callback(null, allReviews);
       })
       //In case of Problem in Fetching from Network
       .catch(error => {
         console.log('Getting Review From Cache Storage');
         DBHelper.getAllCachedReviews(id).then(rev => {
             if (rev) return callback(null, rev);
           }).catch((err) => {
             console.log('Problem in getting Reviews from Cache storage ');
             callback(error, null);
           });
       });
 }


 /**
  * Get Review For Restaurant from Cache Storage.
  * One method will serve to both with and without ID requests here
  */
 static getAllCachedReviews(id) {
   let dbPromise = DBHelper.getRestaurantDB();
   //Obtaining Result
   let res = dbPromise.then(function(db) {
     let transaction = db.transaction('reviews_mst');
     let allReviews = transaction.objectStore('reviews_mst');
     return id!==null ? allReviews.index("group_by_restaurant").get(id) : allReviews.getAll();
   }).catch((err) => {
     console.log('Problem in Getting Reviews for Restaurents '+err);
   });
 return res;
 }

 /**
  * Save Review To Server .
  * This will first try to post review on server
  * If connectivity is not available, it will store review locally
  */
static saveReview(restaurant_id, name, rating, comments, date,callback){
  let url = DBHelper.RESTAURANT_POST_REVIEW;
  //Make Review Object
  let review = {
    restaurant_id : restaurant_id,
    name : name,
    rating : rating,
    comments : comments
  };
  //Post request to Server
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(review)
  })
  .then(response => response.json())
  //If review is stored on server successfull,
  // save to local review storage as well
  .then(response => {
    let dbPromise = DBHelper.getRestaurantDB();
    dbPromise.then(function(db) {
      if(!db) return callback(null, response);
      let transaction = db.transaction('reviews_mst', 'readwrite');
      let reviewStore = transaction.objectStore('reviews_mst');
      reviewStore.put(response);
      return transaction.complete;
    });
    callback(null, response);
  })
  //If Review Not added to Server because of Connection Error,
  // Add it to Pending Store.
  .catch((err) => {
    let dbPromise = DBHelper.getRestaurantDB();
    dbPromise.then(db => {
       if (!db) return;
       let transaction = db.transaction('pending_review_transactions', 'readwrite');
       let store = transaction.objectStore('pending_review_transactions');
       review["createdAt"] = date;
       review["updatedAt"] = date;
       store.put(review);
       return transaction.complete;
    });
    callback(err, null);
  });
}


/**
 * This method will fetch reviews from local store,
 *  and post it to server, follows cycle of saveReview if failed again.
 */
static syncPendingReviews() {
  let dbPromise = DBHelper.getRestaurantDB();
  //Obtaining Result
  let res = dbPromise.then(function(db) {
    let transaction = db.transaction('pending_review_transactions', 'readwrite');
    let reviewStore = transaction.objectStore('pending_review_transactions');
    let reviews = reviewStore.getAll();
    //Clear from local store
    reviewStore.clear();
    return reviews;
  })
  .then((pendingReviews) => {

    console.log("Uploading pending Reviews ");
    pendingReviews.forEach(review => {
      DBHelper.saveReview(review.restaurant_id, review.name,
                            review.rating, review.comments,
                            review.date, (error, response) => {
      // Is it possible that error occur even after getting connection ??
        if (error) {
          console.log(":: Enable background sync again ::");
          navigator.serviceWorker.ready.then(function(registration) {
            registration.sync.register('syncApp').then(function() {
              console.log("Registration of it successfull");
            }, function() {
              // Registration failed
              console.log("Problem in Registration of background sync ");
            });
        });
      }
    });//End-saveReview
  });//End-forEach

  })
  .catch((err) => {
    console.log('Problem in Review Sync: '+err);
  });
return res;
}



// -------------------  DB Utility Methods ------------------- END

}
