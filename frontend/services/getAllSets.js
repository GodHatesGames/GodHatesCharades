'use strict';
app.service('getAllSets', function($q) {
	var allSets = {
		data: [],
		reload: loadData
	};

	function loadData(scope) {
		var deferred = $q.defer();
		var Set = Parse.Object.extend('Set');
		var query = new Parse.Query(Set);
		var promise = query.find();
		promise.then(function(sets) {
			allSets.data = _.extend(allSets.data, sets);
			deferred.resolve(allSets);
			if(scope)
				scope.$digest();
		});
		return deferred.promise;
	}

	return loadData();
});
