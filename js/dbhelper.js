/**
 * Common database helper functions.
 */
class DBHelper {

//var dbPromise = idb.open('mws_restaurants_info', 1, function(upgradeDb) {
//Not using direct variable - using static method instead
  static getRestaurantDB() {
      return idb.open('mws_restaurants_info', 1, upgradeDb => {
        //Upgrade DB if version mismatch
        switch(upgradeDb.oldVersion) {
          case 0:
            if(!upgradeDb.objectStoreNames.contains('restaurants_mst')){
              var restStore = upgradeDb.createObjectStore('restaurants_mst', { keyPath: 'id' });
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
    return `http://localhost:${port}/restaurants`;//Changed according to new server
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
    let url = DBHelper.DATABASE_URL;
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
    let url = DBHelper.DATABASE_URL+"/"+id;
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
// -------------------  DB Utility Methods ------------------- END

}
