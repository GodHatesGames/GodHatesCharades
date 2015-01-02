app.factory('SetItem', function (DS, $q, Suggestion, ParseData) {
	// vars
	var definition = {
		name: 'setItem',
		defaultAdapter: 'setItemAdapter',
		relations: {
			belongsTo: {
				set: {
					localField: 'owner',
					localKey: 'ownerId'
				},
				suggestion: {
					localField: 'card',
					localKey: 'cardId'
				}
			}
		},
		beforeInject: ParseData.flattenAttrsBeforeInject,
		afterInject: _afterInject,
		computed: {
			ownerId: ['owner', _updateOwnerId],
			cardId: ['card', _updateCardId]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks
		}
	}
	var setItemPromises = {};

	// Adapter
	DS.adapters.setItemAdapter = {
		destroy: _destroy
	};

	// constants
	var RELATIONS = ['set', 'suggestion'];

	// init
	var SetItem = DS.defineResource(definition);

	// Static Methods
	SetItem.getSetItemsForSet = _getSetItemsForSet;

	return SetItem;

	// methods

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		ParseData.linkRelationsAfterInject(Suggestion, RELATIONS, this);
	}

	function _updateOwnerId(owner) {
		return this.owner.id;
	}

	function _updateCardId(card) {
		return this.card.id;
	}

	function _getSetItemsForSet(set) {
		console.log('setItem getSetItemsForSet');
		if (setItemPromises[set.id]) {
			// return promise so we dont make the call twice
			return setItemPromises[set.id];
		} else {
			var deferred = $q.defer();
			// save promise if needed
			setItemPromises[set.id] = deferred.promise;
			Parse.Cloud.run(
				CONFIG.PARSE_VERSION + 'getCardsForSet',
				{
					id: set.id,
					includeOwner: true
				},
				{
					success: function(setItems) {
						delete setItemPromises[set.id];
						setItems = SetItem.inject(setItems);
						deferred.resolve(setItems);
					},
					error: function(err) {
						delete setItemPromises[set.id];
						deferred.reject(err);
					}
				}
			);
			return deferred.promise;
		}
	}

	function _destroy(resource, id) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'removeSetItem',
			{
				id: id
			},
			{
				success: deferred.resolve,
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

});