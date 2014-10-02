'use strict';
app.filter('fuse', function() {
	return function (array, keys, target){
		if(array.length  > 0 && keys.length > 0 && target) {
			var options = {
				keys: keys,
				caseSensitive: false,
				includeScore: false,
				threshold: 0.3,
			}
			var fuse = new Fuse(array, options);
			return fuse.search(target);
		} else {
			return array;
		}
	};
});