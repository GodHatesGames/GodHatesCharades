define([
	'angular',
	'parse'
	], 
	function (angular, Parse) {
		var parseUser = angular.module('parse.user', []);

		parseUser.service('parseUser', function factory($rootScope, $q, $location) {
			var user = {
				loggedin: false,
				dataloaded: false,
				isAnon: isAnon,
				isReal: isReal,
				data: null,
				createAnonUser: createAnonUser,
				connect: connect,
				logout: logout
			}

			// check login status
			var currentUser = Parse.User.current();
			if (currentUser) {
				console.log('logged in', currentUser);
				user.data = currentUser;
				user.loggedin = true;
			} else {
				console.log('not logged in');
				user.loggedin = false;
			}

			function createAnonUser() {
				console.log('creating anon user');
				var user = new Parse.User();
				user.set('username', randString());
				user.set('password', randString());
				user.signUp(null, {
					success: onUserConnected,
					error: onUserError
				});

				function randString() {
					// copy pasta'd from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
						return v.toString(16);
					});
				}
			}

			function connect(username, password) {
				//returns Parse.Promise
				var promise = Parse.User.logIn(username, password, {
					success: onUserConnected,
					error: onUserError
				});

				return promise;
			}

			function onUserConnected(userData) {
				// Do stuff after successful login.
				console.log('Welcome', userData.get('username'));
				console.log(userData);

				user.data = userData;
				user.loggedin = true;
				$rootScope.$apply();
			}

			function onUserError(user, error) {
				// The login failed. Check error to see why.
				console.log('Login failed:', error);
				$rootScope.$broadcast('alert', {
					message: error.message
				});
			}

			function logout() {
				Parse.User.logOut();
				user.loggedin = false;
				$location.path('/');
				setTimeout(function(){
					window.location.reload();
				}, 1000);
			}

			// returns true if current user is not Anonymous
			function isReal() {
				if(!user.loggedin)
					return false;
				else
					return user.data !== null && user.data.attributes.email !== undefined;
			}

			// returns true if current user is Anonymous
			function isAnon() {
				if(!user.loggedin)
					return true;
				else if(user.data === null)
					return true;
				else if(user.data.attributes.email === undefined)
					return true;
				else
					return false;
			}

			return user;
		});
});