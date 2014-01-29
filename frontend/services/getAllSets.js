'use strict';
app.service('sets', function($q, $rootScope) {
	// console.log('instantiate sets');
	var sets = {
		data: [],
		reload: loadData,
		byId: {},
		deleteSet: deleteSet,
		getCardsForSet: getCardsForSet,
		addCardToSet: addCardToSet
	};

	function loadData(scope) {
		console.log('sets loadData');
		var deferred = $q.defer();
		Parse.Cloud.run(
			'getAllSets',
			{},
			{
				success: function(setData) {
					// save data
					sets.data = setData;
					//index by id
					sets.byId = {};
					_.each(setData, function(set, index, list) {
						sets.byId[set.id] = set;
					});
					// resolve deffered
					deferred.resolve(sets);
					// digest if scope is passed in
					if(scope) {
						scope.$digest();
					} else {
						$rootScope.$digest();
					}
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

	function deleteSet(set) {
		var deferred = $q.defer();
		
		set.destroy()
		.then(function success() {
			console.log('set deleted');
			return loadData();
		},
		function error(err) {
			console.log('err deleting set:', err);
		})
		.then(function success() {
			deferred.resolve();
		},
		function error(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}

	function getCardsForSet(set) {
		console.log('sets getCardsForSet');
		var deferred = $q.defer();
		Parse.Cloud.run(
			'getCardsForSet',
			{
				id: set.id
			},
			{
				success: function(cards) {
					deferred.resolve(cards);
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

	function addCardToSet(card, set) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			'addCardToSet',
			{
				card: card.id,
				set: set.id
			},
			{
				success: function(setItem) {
					// update data

					// sets.data = setItem;
					//index by id
					// sets.byId[setItem.id] = setItem;
					// resolve deffered
					deferred.resolve(setItem);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

	return loadData();
});