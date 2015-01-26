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
		if(obj._toFullJSON) {
			// is a parse object
			if(obj.attributes) {
				_.each(obj.attributes, function(subObj, key) {
					if(subObj.hasOwnProperty('attributes')) {
						obj.attributes[key] = _createSimpleObject(subObj);
					}
				});
			}

			var newObj = obj._toFullJSON();
			newObj.id = newObj.objectId;
			delete newObj.objectId;
			return newObj;
		} else {
			// not a parse object
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