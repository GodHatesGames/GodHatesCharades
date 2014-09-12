'use strict';
app.controller('fixmeView', function($scope, $window) {
	if($window.location.search) {
		var urlParams = {};
		(function () {
			var pair, // Really a match. Index 0 is the full match; 1 & 2 are the key & val.
				tokenize = /([^&=]+)=?([^&]*)/g,
				// decodeURIComponents escapes everything but will leave +s that should be ' '
				re_space = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); },
				// Substring to cut off the leading '?'
				querystring = $window.location.search.substring(1);

			while (pair = tokenize.exec(querystring))
				urlParams[re_space(pair[1])] = re_space(pair[2]);
		})();

		var base = 'https://www.parse.com';
		var link = '';
		var query = '';
		var param;
		for (param in urlParams) {
		  if (param == 'link') {
			link = urlParams['link'];
		  } else {
			if (query != '') {
			  query += "&";
			}
			query += param + '=' + encodeURIComponent(urlParams[param]);
		  }
		}

		// Ensure there's a leading slash to avoid open redirect
		if (link.charAt(0) !== "/") {
		  link = "/" + link;
		}

		$scope.src = base + link + '?' + query;
	} else {
		$scope.nothing = true;
	}
});