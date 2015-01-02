app.factory('User', function (DS, $q, ParseData) {
	// vars
	var definition = {
		name: 'user',
		defaultAdapter: 'userAdapter',
		relations: {
			hasMany: {
				suggestion: {
					localField: 'suggestions',
					foreignKey: 'ownerId'
				}
			}
		},
		beforeInject: ParseData.flattenAttrsBeforeInject,
		methods: {
			// Instance methods
		}
	}
	var userPromises = {};

	// Adapter
	DS.adapters.userAdapter = {
	};

	// init
	var User = DS.defineResource(definition);

	// Static Methods

	return User;

	// methods


});