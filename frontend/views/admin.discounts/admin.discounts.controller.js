'use strict';
app.controller('discountsView', function(discounts, $scope, Discount) {
  $scope.discounts = discounts;
  $scope.discounts.unshift({});
  $scope.saving = false;
  $scope.saveDiscount = _saveDiscount;

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
});