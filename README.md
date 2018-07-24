
# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 3

### Features Covered

**Part-1** 	&#10004;

 - Make Site UI compatible with a range of display sizes
 - Made All Images Responsive
 - Make Elements visible and usable in viewport
 - Accessibility: Make all element's focus according to accessibility guidelines
 - Accessibility: All site elements defined Semantically
 - Make pages available Offline

**Part-2** &#10004;

 - Addition of Manifest File
 - Fetch JSON from Server  
 - Store JSON to IndexedDB for offline purpose
 - Improve Performance, PWA, Accessibility measures
 - Preserved Responsiveness and Accessibility.

**Part-3**

 - Added Reviews Form (Works offline and Sync on Network Connection)
 - Can Mark Restaurant Favorite (Works offline and Sync on Network Connection)
 - Performance, Accessibility and PWA measures >90
 - Preserved Responsiveness and Accessibility.


### How to run
Execute Following Command to build with gulp and start server. Execute http://localhost:8000/ to access restaurant App.

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
 - Uglify JS ([UglifyJS3](https://skalman.github.io/UglifyJS-online/))
 - Minify CSS ([MinifyCSS](https://www.minifier.org/))
 - Reference for Map Overlay on hover ([Ref](https://stackoverflow.com/questions/21086385/how-to-make-in-css-an-overlay-over-an-image))
