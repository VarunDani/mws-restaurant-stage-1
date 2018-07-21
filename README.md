
# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 3

### Features Covered

 - Addition of Manifest File
 - Fetch JSON from Server  
 - Store JSON to IndexedDB for offline purpose
 - Improve Performance, PWA, Accessibility measures
 - Added Reviews Form (Works offline and Sync on Network Connection)
 - Can Mark Restaurant Favorite (Works offline and Sync on Network Connection)

### How to run
Execute Following Command to build with gulpand start server. Execute http://localhost:8000/ to access restaurant App.

    npm install
    gulp

### Responsive Images
To generate responsive Images use Grunt File and grunt Command for generating source set for project.

	   npm install mandatory before applying grunt command
      "grunt" alone creates a new, completed images directory
      "grunt clean" removes the images directory
      "grunt responsive_images" re-processes images without removing the old

### References

 - Code Base, Udacity Repository ([mws-restaurant-stage-1](https://github.com/udacity/mws-restaurant-stage-1))
 -  Responsive Images, Udacity Repository ([responsive-images](https://github.com/udacity/responsive-images))
 -  Service Worker and Code Reference, Repository ([wittr] (https://github.com/jakearchibald/wittr))
 -  ARIA Breadcrumb section change according to review ([W3 reference link](https://www.w3.org/TR/wai-aria-practices-1.1/examples/breadcrumb/index.html))
 -  Skip Content added for accessibility accrding to review ([Ref](http://terrillthompson.com/blog/161))
 - Fetch API Documentation ([Ref](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))
 - IndexedDB Documentation ([Ref](https://developers.google.com/web/ilt/pwa/working-with-indexeddb))
 - Error Resolution for Quota Exceeded ([Ref](https://stackoverflow.com/questions/21159301/quotaexceedederror-dom-exception-22-an-attempt-was-made-to-add-something-to-st))
 - Yeoman generator for gulp, ([3oilerplate](https://www.npmjs.com/package/generator-3oilerplate))
 - Snack Bar reference Code For Notification ([W3School](https://www.w3schools.com/howto/howto_js_snackbar.asp))
 - IDB Code Help ([IDBPromise](https://github.com/jakearchibald/idb))
 - Website Sync Article (Great Examples!) ([WICG](https://github.com/WICG/BackgroundSync/blob/master/explainer.md))
