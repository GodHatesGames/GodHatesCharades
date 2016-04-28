'use strict';
app.controller('homeView', function(collection, $scope, $window, $timeout, analytics, $location) {// public
  $scope.collection = collection;
  $window.scrollTo(0, 0);
  $scope.$on('youtube.player.ready', _onPlayerReady);
  $scope.$on('$destroy', _onPlayerDestroyed);
  var originalVolume;
  $scope.playerVars = {
    autoplay: 1,
    playsinline: 1,
    showinfo: 0,
    autohide: 1,
    loop: 1,
    rel: 0
  };
  $scope.buyLink = '/store';
  $scope.onBuyClicked = _onBuyClicked;
  // $scope.$watch('homeVideo.setVolume', _onHomeVideo);
  // $scope.$on('youtube.player.ready', _onPlayerReady);

  if($location.search) {
    if($location.$$search.store) {
      $scope.showStore = true;
    }
  }

  function _onPlayerReady() {
    // play it again
    if($scope.homeVideo && $scope.homeVideo.setVolume) {
      console.log('volume updated on homepage');
      originalVolume = $scope.homeVideo.getVolume();
      $scope.homeVideo.mute();
    }
  }

  function _onPlayerDestroyed() {
    $scope.homeVideo.setVolume(originalVolume);
  }

  function _onBuyClicked(location, button) {
    analytics.trackEvent('Click', {
      'Location': location,
      'Button': button
    });
  }

});