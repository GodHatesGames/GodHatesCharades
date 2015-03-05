'use strict';

// requires bower install chunk
app.filter('chunk', function($filter) {
	return function (array, size){
		if(array && array.length > size) {
			return chunk(array, size);
		} else {
			return array;
		}
	};
});