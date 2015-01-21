app.factory('SetItem', function (DS, $q, ParseData) {
	// vars
	var definition = {
		name: 'setItem',
		defaultAdapter: 'setItemAdapter',
		beforeInject: _beforeInject,
		afterInject: _afterInject,
		afterDestroy: _afterDestroy,
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
		findAll: _findAll,
		create: _create
	};

	// constants
	var RELATIONS = ['set', 'suggestion'];

	// init
	var SetItem = DS.defineResource(definition);

	return SetItem;

	// methods

	function _beforeInject(resourceName, parseObject){
		if(parseObject.attributes) {
			ParseData.flattenAttrsBeforeInject(resourceName, parseObject);
		}
		ParseData.linkProperty(parseObject, 'set', 'owner');
		ParseData.linkProperty(parseObject, 'suggestion', 'card');
	}

	function _afterInject(resourceName, parseObject) {
		// parseObject.updateLinks();
		parseObject.owner.addSetItem(parseObject);
		parseObject.card.addSetItem(parseObject);
	}

	function _afterDestroy(resourceName, attrs, cb) {
		var setItem = attrs;
		setItem.card.removeSetItem(setItem);
		setItem.owner.removeSetItem(setItem);
		cb(null, attrs);
	}

	function _updateLinks() {
		ParseData.linkRelationsAfterInject(SetItem, RELATIONS, this);
		// SetItem.linkInverse(this.id);
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
				success: deferred.resolve,
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
					deferred.resolve(setItems);
				},
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _create(resourceConfig, attrs, options) {
		var deferred = $q.defer();
		var set = this;
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'addCardToSet',
			{
				card: attrs.card.id,
				set: attrs.set.id
			},
			{
				success: function(setItem) {
					setItem = SetItem.inject(setItem);
					deferred.resolve(setItem);
				},
				error: function(err) {
					deferred.reject(err);
				}
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
				success: deferred.resolve,
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

});