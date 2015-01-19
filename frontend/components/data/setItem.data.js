app.factory('SetItem', function (DS, $q, ParseData) {
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
		beforeInject: _beforeInject,
		computed: {
			ownerId: ['owner', _updateOwnerId],
			cardId: ['card', _updateCardId]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks
		}
	}

	// Adapter
	DS.adapters.setItemAdapter = {
		destroy: _destroy,
		findAll: _findAll
	};

	// constants
	var RELATIONS = ['set', 'suggestion'];

	// init
	var SetItem = DS.defineResource(definition);

	return SetItem;

	// methods

	function _beforeInject(resourceName, parseObject, cb){
		if(parseObject.attributes) {
			ParseData.flattenAttrsBeforeInject(resourceName, parseObject, cb);
		}
	}

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		ParseData.linkRelationsAfterInject(SetItem, RELATIONS, this);
		SetItem.linkInverse(this.id);
	}

	function _updateOwnerId(owner) {
		return this.owner.id;
	}

	function _updateCardId(card) {
		return this.card.id;
	}

	function _findAll(definition, params, options) {
		if(params) {
			if(params.setId) {
				return _getSetItemsForSet(params.setId);
			} else if(params.suggestionId) {
				return _getSetItemsForSuggestion(params.suggestionId);
			}
		}
		return $q.reject('unhandled SetItem findAll');
	}

	function _getSetItemsForSet(setId) {
		console.log('setItem getSetItemsForSet');
		var deferred = $q.defer();
		// save promise if needed
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getCardsForSet',
			{
				id: setId,
				includeOwner: true
			},
			{
				success: function(setItems) {
					setItems = SetItem.inject(setItems);
					var set = DS.get('set', setId);
					if(set) {
						set.setItems = setItems;
					}
					deferred.resolve(setItems);
				},
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _getSetItemsForSuggestion(suggestionId) {
		console.log('setItem getSetItemsForSet');
		var deferred = $q.defer();
		// save promise if needed
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getCardsForSuggestion',
			{
				id: suggestionId,
				includeOwner: true
			},
			{
				success: function(setItems) {
					setItems = SetItem.inject(setItems);
					var suggestion = DS.get('suggestion', suggestionId);
					if(suggestion) {
						suggestion.setItems = setItems;
					}

					deferred.resolve(setItems);
				},
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _destroy(resource, id) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'removeSetItem',
			{
				id: id
			},
			{
				success: function() {
					SetItem.eject(id);
					deferred.resolve();
				},
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

});