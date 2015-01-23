'use strict';

app.provider('ParseDataSimplifier', function() {

	function _simplify(data) {
		if(_.isArray(data)) {
			_.each(data, function(obj, index) {
				data[index] = _createSimpleObject(obj);
			});
			return data;
		} else {
			return _createSimpleObject(data);
		}
	}

	function _createSimpleObject(obj) {
		var newObj = {
			id: obj.id
		};
		if(obj.attributes) {
			_.extend(newObj, obj.attributes);
		}

		_.each(obj.attributes, function(subObj, key) {
			if(subObj.hasOwnProperty('attributes')) {
				obj.attributes[key] = _createSimpleObject(subObj);
			}
		});
		return newObj;
	}

	this.simplify = _simplify;

	this.$get = function formlyConfig() {
		return this;
	};
	
});

app.factory('ParseData', function (DS, $q, $timeout) {
	var parseData = {
		linkRelationsAfterInject: _linkRelationsAfterInject,
		defaultValueHandler: _defaultValueHandler,
		safeInject: _safeInjectDefer,
		linkProperty: _linkProperty
	};

	return parseData;

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

	function _linkProperty(parseObject, className, property) {

		if(parseObject[property]) {
			// inject user if needed
			var cachedObj = DS.get(className, parseObject[property].id);
			if(cachedObj) {
				parseObject[property] = cachedObj;
			} else {
				parseObject[property] = DS.inject(className, parseObject[property]);
			}
		}
	}

});