'use strict';
var parseUser = angular.module('parse.user', []);

parseUser.service('parseUser', function factory($rootScope, $q, $location, Suggestion) {
	var user = {
		loggedin: false,
		dataloaded: false,
		isAdmin: isAdmin,
		isAnon: isAnon,
		isReal: isReal,
		isBetaUser: isBetaUser,
		isCurrentUser: isCurrentUser,
		data: null,
		createAnonUser: _createAnonUser,
		connect: _connect,
		logout: logout,
		signupAnonUser: signupAnonUser,
		signup: _signup,
		save: _save,
		getProfileById: getProfileById,
		resetPassword: _resetPassword
	};

	var cache = {};
	var fetching = {};
	var profiles = {};

	// check login status
	var currentUser = Parse.User.current();
	if (currentUser) {
		// console.log('logged in', currentUser);
		user.data = currentUser;
		cache[user.data.id] = user.data;
		user.loggedin = true;
		// leanplum.startLeanPlum(user.data)
	} else {
		console.log('not logged in');
		user.loggedin = false;
		// create parse user to be used for suggestions and voting
		// _createAnonUser();
	}

	function _createAnonUser() {
		console.log('creating anon user');
		var deferred = $q.defer();
		
		var newUser = new Parse.User();
		newUser.set('username', randString());
		newUser.set('password', randString());
		newUser.set('name', 'Anonymous');
		newUser.signUp(null, {
			success: onUserConnected,
			error: onUserError
		})
		.then(deferred.resolve, deferred.reject);

		return deferred.promise;

		function randString() {
			// copy pasta'd from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		}
	}

	function _connect(username, password) {
		var deferred = $q.defer();
		//returns Parse.Promise
		Parse.User.logIn(username, password, {
			success: onUserConnected,
			error: onUserError
		})
		.then(deferred.resolve, deferred.reject);

		return deferred.promise;
	}

	function logout() {
		Parse.User.logOut();
		user.loggedin = false;
		$location.path('/');
		// TODO find a better solution for this
		setTimeout(function(){
			window.location.reload();
		}, 1000);
	}

	function signupAnonUser(username, password, email, name) {
		var newUser = new Parse.User();
		if(user.data)
			newUser.set('id', user.data.id);
		newUser.set('username', username);
		newUser.set('password', password);
		newUser.set('email', email);
		newUser.set('name', name);
		return newUser.save(null, {
			success: onUserConnected,
			error: onUserError
		});
	}

	function _signup(username, password, email, name) {
		var newUser = new Parse.User();
		newUser.set('username', username);
		newUser.set('password', password);
		newUser.set('email', email);
		newUser.set('name', name);
		return newUser.save(null, {
			success: onUserConnected,
			error: onUserError
		});
	}

	function _save() {
		var deferred = $q.defer();
		user.data.save()
		.then(function(user) {
				console.log('saved!');
				user.data = user;
			}, function(user, error) {
				console.log('could not save:', error);
			}
		)
		.then(deferred.resolve, deferred.reject);

		return deferred.promise;
	}

	// returns true if current user is not Anonymous
	function isReal() {
		return !isAnon();
	}

	// returns true if current user is Anonymous
	function isAnon() {
		if(user.data === null)
			return true;
		else if(user.data.attributes.email === undefined)
			return true;
		else
			return false;
	}

	function isAdmin() {
		if(user.loggedin)
			return Boolean(user.data.get('admin'));
		else
			return false;
	}

	function isBetaUser() {
		if(user.loggedin)
			return Boolean(user.data.get('beta'));
		else
			return false;
	}

	function isCurrentUser(userid) {
		if (user.loggedin &&
			userid === user.data.id) {
			return true;
		} else {
			return false;
		}
	}

	function getProfileById(id, options) {
		if (id === undefined || id === null) {
			console.log('you must provide a userid');
			return $q.reject();
		}

		if (!options) {
			options = {
				userid: id,
				pageSize: 1000
			};
		} else {
			options.userid = id;
		}

		var deferred = $q.defer();
		if(fetching[id]) {
			console.log('returning existing promise');
			return fetching[id];
		} else if(profiles[id]) {
			console.log('delivering cached user');
			deferred.resolve(profiles[id]);
		} else {
			console.log('fetching user');
			// $scope.loading = true;
			var callbacks = {
				success: onProfileFound,
				error: onProfileError
			};
			Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getProfile', options, callbacks);
			fetching[id] = deferred.promise;
		}

		return deferred.promise;

		function onProfileFound(profile) {
			delete fetching[id];
			var user = profile.owner;
			profiles[user.id] = profile;
			Suggestion.inject(profile.suggestions);
			deferred.resolve(profile);
		}

		function onProfileError(user, error) {
			delete fetching[id];
			deferred.reject(error);
		}

	}

	function cacheUser(userToCache) {
		if(userToCache) {
			// dont override current user
			if(userToCache.id !== user.data.id)
				cache[userToCache.id] = userToCache;
		} else {
			console.log('must provide user to cache');
		}
	}

	function _resetPassword(email) {
		var deferred = $q.defer();
		Parse.User.requestPasswordReset(email, {
			success: deferred.resolve,
			error: deferred.reject
		});
		return deferred.promise;
	}

	return user;
});