'use strict';
app.config(function($stateProvider) {

	$stateProvider.state('404', {
		url: '/404',
		title: 'Page not Found',
		templateUrl: 'views/404View.html',
		controller: '404View'
	});

	$stateProvider.state('error', {
		url: '/error?message',
		title: 'Error accessing page',
		templateUrl: 'views/errorView.html',
		controller: 'errorView'
	});
	$stateProvider.state('card', {
		url: '/card/:cardid/:slug',
		templateUrl: 'views/cardView.html',
		controller: 'cardView',
		resolve: {
			suggestion: ['Suggestion', '$stateParams', function(Suggestion, $stateParams) {
				return Suggestion.find($stateParams.cardid);
			}]
		}
	});
	$stateProvider.state('top.fame', {
		url: '/fame',
		title: 'Hall of Fame',
		description: 'Want to see everyone\'s favorite pairs?',
		templateUrl: 'views/topView.detail.html',
		controller: 'topView.fame',
		resolve: {
			pairs: ['leaderboard', function(leaderboard) {
				return leaderboard.getTop();
			}]
		}
	});
	$stateProvider.state('top.shame', {
		url: '/shame',
		title: 'Hall of Shame',
		description: 'Want to see everyone\'s most despised pairs?',
		templateUrl: 'views/topView.detail.html',
		controller: 'topView.shame',
		resolve: {
			pairs: ['leaderboard', function(leaderboard) {
				return leaderboard.getTop();
			}]
		}
	});
	$stateProvider.state('top.controversial', {
		url: '/controversial',
		title: 'Controversial',
		description: 'Want to see everyone\'s most loved and hated pairs?',
		templateUrl: 'views/topView.detail.html',
		controller: 'topView.controversial',
		resolve: {
			pairs: ['leaderboard', function(leaderboard) {
				return leaderboard.getTop();
			}]
		}
	});
	
	// Admin
	$stateProvider.state('admin', {
		url: '/admin',
		abstract: true,
		title: 'Admin',
		template: '<ui-view></ui-view>'
	});
	
	$stateProvider.state('admin.export', {
		url: '/export',
		title: 'Export',
		templateUrl: 'views/exportView.html',
		resolve: {
			suggestions: ['Suggestion', function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			}],
			allSets: ['Set', 'suggestions', function(Set, suggestions) {
				return Set.getAllSetsAndItems();
			}]
		},
		controller: 'exportView'
	});

	$stateProvider.state('admin.sets.create', {
		url: '/create',
		title: 'allSets: Create a set',
		templateUrl: 'views/setsCreateView.html',
		controller: 'setsCreateView'
	});

	$stateProvider.state('admin.sets.detail', {
		url: '/detail/:id',
		title: 'Set Details',
		templateUrl: 'views/setsDetailView.html',
		resolve: {
			set: ['Set', '$stateParams', function(Set, $stateParams) {
				return Set.find($stateParams.id);
			}],
			setItems: ['set', '$stateParams', 'SetItem', function(set, $stateParams, SetItem) {
				var params = {
					setId: $stateParams.id
				};
				return SetItem.findAll(params);
			}]
		},
		controller: 'setsDetailView'
	});

	$stateProvider.state('admin.components', {
		url: '/components',
		title: 'Components',
		templateUrl: 'views/componentsView.html'
	});

	$stateProvider.state('admin.elements', {
		url: '/elements',
		title: 'Elements',
		templateUrl: 'views/elementsView.html',
		controller: 'elementsView'
	});

	$stateProvider.state('admin.cards', {
		url: '/cards',
		title: 'Components',
		templateUrl: 'views/cardsView.html'
	});

	$stateProvider.state('blog', {
		url: '/blog',
		title: 'Blog',
		description: 'All the latest news about our game and our ramblings about our favorite games made by others.',
		templateUrl: 'views/blogView.html',
		resolve: {
			posts: ['prismic', function(prismic) {
				return prismic.getBlogPosts();
			}]
		},
		controller: 'blogView'
	});
	// Mail
	$stateProvider.state('mail', {
		url: '/mail',
		abstract: true,
		template: '<ui-view></ui-view>'
	});
	$stateProvider.state('mail.thanks', {
		url: '/thanks',
		title: 'Subscription Confirmation',
		description: 'Thanks for subscribing to our mailing list.',
		templateUrl: 'views/mail.thanksView.html'
	});
	$stateProvider.state('fixme', {
		url: '/fixme',
		title: 'Fix yoself',
		description: 'If you\'re having account problems, you\'re in the right place',
		templateUrl: 'views/fixmeView.html',
		controller: 'fixmeView'
	});
});