'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('admin.discounts', {
    url: '/discounts',
    title: 'Discounts',
    templateUrl: 'views/admin.discounts/admin.discounts.html',
    resolve: {
      discounts: function(Discount) {
        return Discount.findAll();
      }
    },
    controller: 'discountsView'
  });
});