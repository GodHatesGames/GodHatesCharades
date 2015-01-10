app.factory('Suggestion', function (DS, $q, Slug, DSCacheFactory, $urlMatcherFactory, $state, $filter, ParseData, User) {
	// vars
	var definition = {
		name: 'suggestion',
		defaultAdapter: 'suggestionAdapter',
		relations: {
			belongsTo: {
				user: {
					localField: 'owner',
					localKey: 'ownerId'
				}
			},
			hasMany: {
				setItem: {
					localField: 'setItems',
					foreignKey: 'cardId'
				}
			}
		},
		computed: {
			ownerId: ['owner', _updateOwnerId]
		},
		methods: {
			// Instance methods
			getTypeDisplay: _getTypeDisplay,
			getTypeClass: _getTypeClass,
			getSlug: _getSlug,
			getLink: _getLink,
			getUrl: _getUrl,
			getImageUrl: _getImageUrl,
			getTotalVotes: _getTotalVotes,
			getTotalSkips: _getTotalSkips,
			getKDR: _getKDR,
			getTotalViews: _getTotalViews,
			getOwnerName: _getOwnerName,
			updateLinks: _updateLinks
		},
		beforeInject: _beforeInject
	}

	// Adapter
	DS.adapters.suggestionAdapter = {
		find: _find
	};

	// Constants
	var TYPE_DISPLAY_CHARACTER = "Actor";
	var TYPE_DISPLAY_SCENARIO = "Scenario";
	var TYPE_CLASS_CHARACTER = "character";
	var TYPE_CLASS_SCENARIO = "scenario";
	var RELATIONS = ['user', 'setItem'];
	var INJECT_OPTIONS = {
	};

	var Suggestion = DS.defineResource(definition);
	// Static Methods
	Suggestion.getBlankCardByType = _getBlankCardByType;
	Suggestion.getTypeDisplayByType = _getTypeDisplayByType;
	Suggestion.getTypeClassByType = _getTypeClassByType;
	Suggestion.getImageByType = _getImageByType;
	Suggestion.getExamples = _getExamples;
	Suggestion.getUnmoderatedSuggestions = _getUnmoderatedSuggestions;
	Suggestion.getSuggestionPairs = _getSuggestionPairs;
	Suggestion.getAllApprovedSuggestions = _getAllApprovedSuggestions;

	return Suggestion;

	// methods

	function _beforeInject(resourceName, parseObject, cb){
		if(parseObject.attributes) {
			if(parseObject.attributes.owner.attributes) {
				// inject user if needed
				var cachedOwner = User.get(parseObject.attributes.owner.id);
				if(!cachedOwner)
					User.inject(parseObject.attributes.owner);
			}
			ParseData.flattenAttrsBeforeInject(resourceName, parseObject, cb);
		} else {
			console.log('injecting empty or non-server suggestion');
		}
	}

	function _afterInject(resourceName, parseObject, cb) {
		// parseObject.updateLinks(['user']);
	}

	function _updateLinks(relations) {
		// if(!relations) relations = RELATIONS;
		// ParseData.linkRelationsAfterInject(Suggestion, relations, this);
		// Suggestion.linkInverse(this.id);
	}

	function _updateOwnerId(owner) {
		if(this.owner)
			return this.owner.id;
		else {
			console.log('why no owner');
		}
	}

	function _getTypeDisplay() {
		var type = this.type;
		return Suggestion.getTypeDisplayByType(type);
	}

	function _getTypeDisplayByType(type) {
		switch(type) {
			case 0 :
				return TYPE_DISPLAY_CHARACTER;
			case 1 :
				return TYPE_DISPLAY_SCENARIO;
		}
	}

	function _getTypeClass() {
		return Suggestion.getTypeClassByType(this.type);
	}

	function _getSlug() {
		var text = this.text;
		return Slug.slugify(text);
	}

	function _getLink() {
		return {
			cardid: this.id,
			slug: this.getSlug()
		};
	}

	function _getUrl() {
		var cardState = $state.get('card').url;
		var matcher = $urlMatcherFactory.compile(cardState);
		var path = matcher.format(this.getLink());
		return [
			'http://godhatescharades.com',
			path
		].join('');
	}

	function _getImageUrl() {
		var type = this.type;
		return Suggestion.getImageByType(type);
	}

	function _getTotalVotes() {
		var totalVotes = this.totalVotes;
		return totalVotes ? totalVotes : 0;
	}

	function _getTotalSkips() {
		var totalSkips = this.skipped;
		return totalSkips ? totalSkips : 0;
	}

	function _getKDR() {
		var kills = this.getTotalVotes();
		var deaths = this.getTotalSkips();
		if(deaths === 0) {
			return 0;
		} else {
			var kdr = kills / deaths;
			return $filter('number')(kdr, 1);
		}
	}

	function _getTotalViews() {
		return this.getTotalVotes() + this.getTotalSkips();
	}

	function _getOwnerName() {
		if(this.owner)
			return this.owner.name;
	}

	function _find(resource, id) {
		var cached = Suggestion.get(id);

		if(cached) {
			return $q.when(cached);
		} else {
			// else fetch data
			var options = {
				id: id
			};
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getCardById', options);
		}
	}

	function _getAllApprovedSuggestions() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSuggestions',
			{},
			{
				success: _onSuggestionListSuccess.bind(deferred),
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _getExamples() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'examples',
			{
				id: CONFIG.EXAMPLE_SET_ID
			},
			{
				success: function(examples) {
					// _cache(suggestions);
					//TODO: Setup injection
					// DS.inject(definition.name, examples);
					deferred.resolve(examples);
				},
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	function _getUnmoderatedSuggestions() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getUnmoderatedSuggestions',
			{}, 
			{
				success: _onSuggestionListSuccess.bind(deferred),
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	function _onSuggestionListSuccess(suggestions) {
		// _cache(suggestions);
		suggestions = Suggestion.inject(suggestions, INJECT_OPTIONS);
		this.resolve(suggestions);
	}

	function _getSuggestionPairs(skip) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getRandomSuggestionPairs',
			{
				skip: skip
			}, 
			{
				success: function(pairs) {
					_.each(pairs, function(pair) {
						pair['0'] = Suggestion.inject(pair['0']);
						pair['1'] = Suggestion.inject(pair['1']);
					})
					deferred.resolve(pairs);
				},
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	function _getBlankCardByType(type) {
		return {
			type: type
		};
	}

	function _getImageByType(type) {
		switch(type) {
			case 0 :
				return 'img/actor_skull.svg';
			case 1 :
				return 'img/scenario_ball.svg';
		}
	}

	function _getTypeClassByType(type) {
		switch(type) {
			case 0 :
				return TYPE_CLASS_CHARACTER;
			case 1 :
				return TYPE_CLASS_SCENARIO;
			default :
				console.log('unhandled card type:', type);
				break;
		}
	}

});