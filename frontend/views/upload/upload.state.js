'use strict';

angular.module('app')
.config(function ($stateProvider) {

  $stateProvider.state('admin.upload', {
    url: '/upload',
    title: 'Upload',
    templateUrl: 'views/upload/upload.html',
    controller: 'uploadView'
  });
});