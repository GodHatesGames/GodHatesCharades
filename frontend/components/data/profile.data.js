app.factory('Profile', function (DS, $q, ParseData, User, Suggestion) {
	// vars
	var definition = {
		name: 'profile',
		defaultAdapter: 'profileAdapter',
		afterInject: _afterInject,
		relations: {
			belongsTo: {
				user: {
					localField: 'owner',
					localKey: 'id'
				}
			},
			hasMany: {
				suggestion: {
					localField: 'suggestions',
					foreignKey: 'ownerId'
				}
			}
		},
		computed: {
			id: ['owner', _updateId]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks
		}
	}
	var RELATIONS = ['user', 'suggestion'];

	// Adapter
	DS.adapters.profileAdapter = {
		find: _find
	};

	// init
	var Profile = DS.defineResource(definition);

	return Profile;

	// definition methods
	function _updateId(owner) {
		return this.owner.id;
	}

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		// if(!relations) relations = RELATIONS;
		ParseData.linkRelationsAfterInject(Profile, RELATIONS, this);
		// Suggestion.linkInverse(this.id);
	}

	// adapter methods
	function _find(resource, id) {
		var cached = Profile.get(id);

		if(cached) {
			return $q.when(cached);
		} else {

			var options = {
				userid: id,
				pageSize: 1000
			};

			var deferred = $q.defer();
			console.log('fetching user');
			// $scope.loading = true;
			var callbacks = {
				success: function(profile) {
					Suggestion.inject(profile.suggestions);
					var user = User.inject(profile.owner);
					user.updateLinks();
					deferred.resolve(profile);
				},
				error: deferred.reject
			};
			Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getProfile', options, callbacks);

			return deferred.promise;
		}
	}

	// class methods

	// instance methods




});