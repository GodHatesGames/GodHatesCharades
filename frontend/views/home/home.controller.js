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
  $scope.buyLink = 'https://godhatesgames.myshopify.com/cart/1051755037:1';
  $scope.buyImg = 'img/Homepage_Game_01.gif';
  $scope.buyImgBottomBlur = 'img/Homepage_Game_02.gif';
  $scope.buyImgBottomHover = 'img/Homepage_Game_02_Hover.gif';
  $scope.buyImg2 = $scope.buyImgBottomBlur;
  $scope.promo = 'buy';
  $scope.onBuyClicked = _onBuyClicked;
  // $scope.$watch('homeVideo.setVolume', _onHomeVideo);
  // $scope.$on('youtube.player.ready', _onPlayerReady);

  var search = $location.$$search;
  if(search) {
    if(search.store) {
      $scope.promo = 'store';
    } else if(search.vibrator) {
      $scope.promo = 'vibrator';
      $scope.searchLink = '/store';
      $scope.searchImg = 'img/ghc_buy_now.gif';
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