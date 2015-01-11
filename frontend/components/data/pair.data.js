app.factory('Pair', function (DS, $q, Suggestion, ParseData, Slug, $filter) {
	// vars
	var definition = {
		name: 'pair',
		defaultAdapter: 'pairAdapter',
		relations: {
			belongsTo: {
				suggestion: [
					{
						localField: 'actor',
						localKey: 'actorId'
					},
					{
						localField: 'scenario',
						localKey: 'scenarioId'
					}
				]
			}
		},
		beforeInject: _beforeInject,
		afterInject: _afterInject,
		computed: {
			actorId: ['actor', _updateActorID],
			scenarioId: ['scenario', _updateScenarioId],
			chosen: ['chosen', ParseData.defaultValueHandler(0)],
			skips: ['skipped', ParseData.defaultValueHandler(0)],
			views: ['displayed', ParseData.defaultValueHandler(0)],
			slug: ['actor', 'scenario', _updateSlug],
			link: ['slug', 'id', _updateLink],
			kdr: ['chosen', 'skips', _updateKdr],
			controversy: ['controversy', ParseData.defaultValueHandler(0)]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks
		}
	}

	// Adapter
	DS.adapters.pairAdapter = {
		find: _find
	};

	// constants
	var RELATIONS = ['suggestion'];

	// init
	var Pair = DS.defineResource(definition);

	// Static Methods
	Pair.getPairsByCard = _getPairsByCard;

	return Pair;

	// methods

	function _beforeInject(resourceName, parseObject, cb){
		if(parseObject.attributes) {
			Suggestion.inject(parseObject.attributes.actor);
			Suggestion.inject(parseObject.attributes.scenario);
			ParseData.flattenAttrsBeforeInject(resourceName, parseObject, cb);
			if(!parseObject.controversy) parseObject.controversy = 0;
		} else {
			console.log('injecting non-server pair');
		}
	}

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		ParseData.linkRelationsAfterInject(Pair, RELATIONS, this);
	}

	function _updateActorID(actor) {
		return this.actor.id;
	}

	function _updateScenarioId(scenario) {
		return this.scenario.id;
	}

	function _getPairsByCard(card) {
		var deferred = $q.defer();
		console.log('getPairsByCard:', card.id);
		var returnVal;
		var options = {
			cardid: card.id,
			cardtype: card.typeDisplay.toLowerCase()
		};
		Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getPairsByCard', options)
		.then(_onCardPairsFetched, deferred.reject);

		return deferred.promise;

		function _onCardPairsFetched(pairs) {
			pairs = Pair.inject(pairs);
			deferred.resolve(pairs);
		}
	}

	function _updateSlug(actor, scenario) {
		var text = [actor.text,
		            scenario.text].join(' ');
		return Slug.slugify(text);
	}

	function _updateLink(slug, id) {
		return {
			pairid: id,
			slug: slug
		}
	}

	function _updateKdr(chosen, skips) {
		var kdr = chosen / skips;
		return $filter('number')(kdr, 2);
	}

	function _find(resource, id) {
		var cached = Pair.get(id);

		if(cached) {
			return $q.when(cached);
		} else {
			// else fetch data
			var options = {
				id: id
			};
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getPairById', options);
		}
	}

});