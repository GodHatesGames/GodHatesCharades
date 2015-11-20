'use strict';
app.controller('discountsView', function(discounts, $scope, $state, Discount) {
  $scope.discounts = discounts;
  $scope.discounts.unshift({});
  $scope.saves = {};
  $scope.saveDiscount = _saveDiscount;
  $scope.destroyDiscount = _destroyDiscount;

  function _saveDiscount(discount) {
    if(discount.id) {
      $scope.saves[discount.id] = true;
      Discount.update(discount.id, discount)
      .then(function() {
        delete $scope.saves[discount.id];
      });
    } else {
      discount.saving = true;
      Discount.create(discount)
      .then(function(newDiscount) {
        $scope.discounts.push(newDiscount);
        $scope.discounts[0] = {};
      });
    }
  }

  function _destroyDiscount(discount) {
    Discount.destroy(discount.id)
    .then(function() {
      var index = $scope.discounts.indexOf(discount);
      $scope.discounts.splice(index, 1);
    });
  }
});