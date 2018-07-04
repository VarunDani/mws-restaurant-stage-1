if (navigator.serviceWorker){
  navigator.serviceWorker.register('/sw.js').then(function(reg) {
    /*if (!navigator.serviceWorker.controller) {
      return;//Find out why this was not working in Gulp 
    }*/
    console.log('Service worker registration successfull');
  }).catch((err) => {
    console.log('Problem in service worker registration'+err);
  });
  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}
