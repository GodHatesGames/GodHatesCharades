'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('watcher', {
    url: '/watch',
    title: 'Watch',
    description: 'Watch people make fools out of themselves on the internet!',
    templateUrl: 'views/watch/watch.html',
    controller: 'watchView',
    resolve: {
      readyForUpload: ['ytUploadService', function(ytUploadService) {
        return ytUploadService.waitForLoad();
      }],
      ghcVids:['Restangular', function(Restangular) {
        var params = {
          part: 'snippet',
          key: CONFIG.YOUTUBE.key,
          q: '"God Hates Charades"',
          type: 'video',
          order: 'date'
        }
        return Restangular.oneUrl('ghcVids', 'https://www.googleapis.com/youtube/v3/').one('search').get(params);
      }]
    }
  });
});