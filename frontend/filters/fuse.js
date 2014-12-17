'use strict';
app.filter('fuse', function($filter) {
	return function (array, keys, target, sortOverrideKeys){
		if(array.length  > 0 && keys.length > 0 && target) {
			var sortOverride = false;
			if(sortOverrideKeys)
				sortOverride = true;
			var options = {
				keys: keys,
				caseSensitive: false,
				includeScore: false,
				shouldSort: !sortOverride,
				threshold: 0.3,
			}
			var fuse = new Fuse(array, options);
			var fusedArr = fuse.search(target);
			if(sortOverride) {
				return $filter('orderBy')(fusedArr, sortOverrideKeys);
			} else {
				return fusedArr;
			}
		} else {
			return $filter('orderBy')(array, (sortOverrideKeys || keys));
		}
	};
});