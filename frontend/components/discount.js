'use strict';
app.directive('discount', function($rootScope, $location) {
  return {
    restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
    templateUrl: 'components/discount.html',
    replace: true,
    controller: function ($scope, $element, Discount, $state) {
      Discount.getFeaturedDiscount()
      .then(_addDiscount);

      _checkDiscountCode();

      $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        // console.log('page loaded:', $rootScope.currentUrl);
        _checkDiscountCode();
      });

      function _checkDiscountCode() {
        if(window.location.search && $scope.lastSearch !== window.location.search) {
          $scope.lastSearch = window.location.search;
          Discount.getDiscountByParams({
            search: $location.$$search
          })
          .then(_addDiscount);
        }
      }

      function _addDiscount(discount) {
        $scope.discount = discount;
        angular.element(document.body).addClass('discounted');
      }
    }
  };
});