app.factory('ParseData', function (DS, $q, $timeout) {
	var parseData = {
		flattenAttrsBeforeInject: _flattenAttrsBeforeInject,
		linkRelationsAfterInject: _linkRelationsAfterInject,
		defaultValueHandler: _defaultValueHandler,
		safeInject: _safeInjectDefer
	};

	return parseData;

	function _flattenAttrsBeforeInject(resourceName, parseObject, cb){
		_.extend(parseObject, parseObject.attributes);
		delete parseObject.attributes;
	}

	function _linkRelationsAfterInject(constructor, relations, parseObject) {
		constructor.link(parseObject.id, relations);
	}

	function _defaultValueHandler(defaultValue) {
		return function _defaultFunc(newValue) {
			return newValue || defaultValue;
		}
	}

	function _safeInjectDefer(resourceName, items) {
		if(_.isArray(items)) {
			var returnItems = [];
			var promises = [];
			_.each(items, function(item) {
				var cached = DS.get(resourceName, item.id);
				var promise;
				if(cached) {
					// console.log('found one');
					promise = $q.when(cached);
				} else {
					var itemDeferred = $q.defer();
					promise = itemDeferred.promise;
					$timeout(function() {
						this.resolve(DS.inject(resourceName, item));
					}.bind(itemDeferred));
				}
				promises.push(promise);
			});
			return $q.all(promises);
		} else {
			return $q.when(DS.inject(resourceName, items));
		}
	}

});