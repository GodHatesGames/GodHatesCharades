'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('vote', {
    url: '/vote',
    title: 'Vote',
    description: 'Vote on cards submitted by other players to help us choose the best ones.',
    templateUrl: 'views/vote/vote.html',
    controller: 'voteView'
  });
});