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
  $scope.buyLink = 'https://godhatesgames.myshopify.com/cart/8187188801:1?discount=TENBUCKS';
  $scope.buyImg = 'img/Homepage_FullDeal.jpg';
  $scope.onBuyClicked = _onBuyClicked;
  // $scope.$watch('homeVideo.setVolume', _onHomeVideo);
  // $scope.$on('youtube.player.ready', _onPlayerReady);

  var search = $location.$$search;
  if(search) {
    if(search.store) {
      $scope.showStore = true;
    } else if(search.classic) {
      $scope.buyLink = '/store';
      $scope.buyImg = 'img/ghc_buy_now.gif';
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