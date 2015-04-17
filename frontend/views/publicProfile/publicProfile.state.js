'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('user', {
    type: 'profile',
    url: '/user/:userid',
    templateUrl: 'views/publicProfile/publicProfile.html',
    controller: 'publicProfileView',
    resolve: {
      publicProfile: ['Profile', '$stateParams', function(Profile, $stateParams) {
        return Profile.find($stateParams.userid);
      }]
    }
  });
});