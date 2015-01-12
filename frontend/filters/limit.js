'use strict';
app.filter('limit', function($filter) {
	var limitFilter = $filter('limitTo');
	return function (array, limit, limitHolder){
		if(array && limit && limitHolder)
			limitHolder.loaded = (limit >= array.length);
		return limitFilter(array, limit);
	};
});