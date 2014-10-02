'use strict';
app.filter('fuse', function() {
	return function (array, keys, target, sort){
		if(array.length  > 0 && keys.length > 0 && target) {
			if(sort === undefined)
				sort = true;
			var options = {
				keys: keys,
				caseSensitive: false,
				includeScore: false,
				shouldSort: sort,
				threshold: 0.3,
			}
			var fuse = new Fuse(array, options);
			return fuse.search(target);
		} else {
			return array;
		}
	};
});