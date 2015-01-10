app.factory('Profile', function (DS, $q, ParseData, User, Suggestion) {
	// vars
	var definition = {
		name: 'profile',
		defaultAdapter: 'profileAdapter',
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
				success: deferred.resolve,
				error: deferred.reject
			};
			Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getProfile', options, callbacks);

			return deferred.promise;
		}
	}

	// class methods

	// instance methods




});