'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('admin.sets.detail', {
    url: '/detail/:id',
    title: 'Set Details',
    templateUrl: 'views/admin.sets.detail/admin.sets.detail.html',
    resolve: {
      set: ['Set', '$stateParams', function(Set, $stateParams) {
        return Set.find($stateParams.id);
      }],
      setItems: ['set', '$stateParams', 'SetItem', function(set, $stateParams, SetItem) {
        var params = {
          setId: $stateParams.id
        };
        return SetItem.findAll(params);
      }]
    },
    controller: 'setsDetailView'
  });
});