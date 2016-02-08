'use strict';
app.controller('wholesaleView', function(wholesaleDoc, collection, $scope) {
  // public
  $scope.collection = collection;
  
  var structuredText = wholesaleDoc.getStructuredText('doc.content');
  $scope.wholesaleHtml = structuredText.asHtml();

  // Init
});