'use strict';

angular.module('app')
.config(function ($stateProvider) {

  $stateProvider.state('admin.upload', {
    url: '/upload',
    title: 'Upload',
    templateUrl: 'views/admin.upload/admin.upload.html',
    controller: 'uploadView'
  });
});