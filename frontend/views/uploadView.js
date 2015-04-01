'use strict';
app.controller('uploadView', function($scope, Restangular) {
  $scope.refresh = _refresh;

  _refresh();

  function _refresh() {
    Restangular.one('files').get()
    .then(_onFilesLoaded);
  }

  function _onFilesLoaded(response) {
    $scope.files = response;
  }
});