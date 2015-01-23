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
		// save promise if needed
		var query = {
			id: setId,
			includeOwner: true
		};
		return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getCardsForSet', query);
	}

	function _getSetItemsForSuggestion(suggestionId) {
		console.log('setItem getSetItemsForSet');
		// save promise if needed
		var query = {
			id: suggestionId,
			includeOwner: true
		};
		return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getCardsForSuggestion', query);
	}

	function _create(resourceConfig, attrs, options) {
		var set = this;
		var setItemData = {
			card: attrs.card.id,
			set: attrs.set.id
		};
		return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'addCardToSet', setItemData);
	}

	function _destroy(resource, id) {
		var obj = {
			id: id
		};
		return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'removeSetItem', obj);
	}

});