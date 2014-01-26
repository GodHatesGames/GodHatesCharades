'use strict';
app.service('getAllSuggestions', function($q) {
	var getAllSuggestions = {
		data: {},
		reload: loadData
	};

	function loadData(scope) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			'getAllSuggestions',
			{},
			{
				success: function(suggestions) {
					getAllSuggestions = _.extend(getAllSuggestions.data, suggestions);
					deferred.resolve(getAllSuggestions);
					// if (scope)
					// 	scope.$digest();
				},
				error: function(err) {
					deferred.reject(err);
					// if (scope)
					// 	scope.$digest();
				}
			}
		);
		return deferred.promise;
	}

	return loadData();
});
