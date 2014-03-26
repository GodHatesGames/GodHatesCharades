'use strict';
app.config(function($stateProvider,
			 $urlRouterProvider) {

	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise('/card');

	$stateProvider.state('card', {
		url: '/card/:cardid',
		templateUrl: 'export/exportView.html',
		resolve: {
			cardData: function($stateParams, $q, cardService) {
				var deferred = $q.defer();
				Parse.Cloud.run(
					'getCard',
					{
						id: $stateParams.cardid
					},
					{
						success: function(card) {
							cardService.cache([card]);
							deferred.resolve(card);
						},
						error: function(err) {
							deferred.reject(err);
						}
					}
				);
				return deferred.promise;
			}
		},
		controller: 'exportView'
	});

});