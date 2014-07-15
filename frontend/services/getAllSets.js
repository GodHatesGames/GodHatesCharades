'use strict';
app.service('sets', function($q, $rootScope) {
	// console.log('instantiate sets');
	var sets = {
		data: [],
		getAllSets: getAllSets,
		byId: {},
		setItemsById: {},
		deleteSet: deleteSet,
		getSetItemsForSet: getSetItemsForSet,
		addCardToSet: addCardToSet,
		removeSetItem: removeSetItem
	};

	function getAllSets(scope) {
		console.log('sets loadData');
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSets',
			{},
			{
				success: function(setData) {
					// save data
					sets.data = setData;
					//index by id
					sets.byId = _.indexBy(setData, 'id');
					// resolve deffered
					deferred.resolve(setData);
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

	var gettingSetItemsPromises = {};
	function getSetItemsForSet(set) {
		console.log('sets getSetItemsForSet');
		if (gettingSetItemsPromises[set.id]) {
			// return promise so we dont make the call twice
			return gettingSetItemsPromises[set.id];
		} else {
			var deferred = $q.defer();
			// save promise if needed
			gettingSetItemsPromises[set.id] = deferred.promise;
			Parse.Cloud.run(
				CONFIG.PARSE_VERSION + 'getCardsForSet',
				{
					id: set.id,
					includeOwner: true
				},
				{
					success: function(setItems) {
						delete gettingSetItemsPromises[set.id];
						sets.setItemsById[set.id] = setItems;
						deferred.resolve(setItems);
					},
					error: function(err) {
						delete gettingSetItemsPromises[set.id];
						deferred.reject(err);
						// if (scope)
						// 	scope.$digest();
					}
				}
			);
			return deferred.promise;
		}
	}

	function addCardToSet(card, set) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'addCardToSet',
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

	function removeSetItem(setItem) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'removeSetItem',
			{
				id: setItem.id
			},
			{
				success: function(success) {
					deferred.resolve(success);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

	return sets;
});