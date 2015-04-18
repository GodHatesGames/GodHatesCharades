'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('admin.elements', {
    url: '/elements',
    title: 'Elements',
    templateUrl: 'views/admin.elements/admin.elements.html',
    controller: 'elementsView'
  });
});