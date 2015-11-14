'use strict';
app.controller('discountsView', function(discounts, $scope, $state, Discount) {
  $scope.discounts = discounts;
  $scope.discounts.unshift({});
  $scope.saving = false;
  $scope.saveDiscount = _saveDiscount;
  $scope.destroyDiscount = _destroyDiscount;

  function _saveDiscount(discount) {
    if(discount.id) {
      discount.saving = true;
      var update = {
        id: discount.id,
        code: discount.code,
        paramKey: discount.paramKey,
        paramValue: discount.paramValue,
        feature: discount.feature
      };
      Discount.update(update.id, update)
      .then(function() {
        discount.saving = false;
        $state.go('admin.discounts');
      });
    } else {
      discount.saving = true;
      var newDiscount = {
        id: discount.id,
        code: discount.code,
        paramKey: discount.paramKey,
        paramValue: discount.paramValue,
        feature: discount.feature
      };
      Discount.create(newDiscount)
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