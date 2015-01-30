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
		if(obj && obj._toFullJSON) {
			// is a parse object
			if(obj.attributes) {
				_.each(obj.attributes, function(subObj, key) {
					if(subObj.hasOwnProperty('attributes')) {
						obj.attributes[key] = _simplify(subObj);
					}
				});
			}

			var newObj = obj._toFullJSON();
			newObj.id = newObj.objectId;
			delete newObj.objectId;
			return newObj;
		} else {
			// not a parse object, check properties
			if(_.isObject(obj)) {
				_.each(obj, function(prop, key){
					if(_.isObject(prop)) {
						obj[key] = _simplify(prop);
					}
				});
			}
			return obj;
		}
	}

	this.simplify = _simplify;

	this.$get = function formlyConfig() {
		return this;
	};
	
});

app.factory('ParseData', function (DS, $q, $timeout, ParseDataSimplifier) {
	var parseData = {
		linkRelationsAfterInject: _linkRelationsAfterInject,
		defaultValueHandler: _defaultValueHandler,
		inject: _inject,
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

	function _inject(resourceName, items) {
		var simpleItems = ParseDataSimplifier.simplify(items);
		return DS.inject(resourceName, simpleItems);
	}

	function _linkProperty(parseObject, className, property) {
		if(parseObject[property]) {
			if(_.isArray(parseObject[property])) {
				// inject array
				parseObject[property] = DS.inject(className, parseObject[property]);
			} else {
				// check cache for object
				var cachedObj = DS.get(className, parseObject[property].id);
				if(cachedObj) {
					parseObject[property] = cachedObj;
				} else {
					parseObject[property] = DS.inject(className, parseObject[property]);
				}
			}
		}
	}

});