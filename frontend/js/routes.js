'use strict';
app.config(function($stateProvider,
			 $urlRouterProvider) {

	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise('/404');

	$stateProvider.state('404', {
		url: '/404',
		title: 'Page not Found',
		templateUrl: 'views/404View.html',
		controller: '404View'
	});

	var homeState = {
		url: '/?vine&youtube',
		title: 'Your favorite new party game',
		description: 'A game where you act out the vile and despicable inside all of us. Talk, shout, and say awful things in the form of 30 second act outs.',
		templateUrl: 'views/homeView.html',
		controller: 'homeView'
	};

	$stateProvider.state('home', homeState);

	$stateProvider.state('home.vineUnlock', {
		parent: homeState,
		templateUrl: 'views/homeView.vineUnlock.html'
	});

	$stateProvider.state('home.videoUnlock', {
		parent: homeState,
		templateUrl: 'views/homeView.videoUnlock.html'
	});

	$stateProvider.state('home.default', {
		parent: homeState,
		templateUrl: 'views/homeView.default.html'
	});

	$stateProvider.state('home.examples', {
		parent: homeState,
		templateUrl: 'views/homeView.examples.html'
	});

	$stateProvider.state('home.examplesUnlock', {
		parent: homeState,
		templateUrl: 'views/homeView.examplesUnlock.html'
	});

	$stateProvider.state('submit', {
		url: '/submit',
		title: 'Create: Suggest a new card',
		description: 'We need your help coming up with funny new cards. Submit your favorite ideas here.',
		templateUrl: 'views/submitView.html'
	});
	$stateProvider.state('vote', {
		url: '/vote',
		title: 'Vote: Help us choose new cards',
		description: 'Vote on cards submitted by other players to help us choose the best ones.',
		templateUrl: 'views/voteView.html'
	});
	$stateProvider.state('login', {
		url: '/login',
		title: 'Login: Access our community site',
		description: 'Join our community site and help us improve the game.',
		templateUrl: 'views/loginView.html',
		resolve: {
			parseUser: 'parseUser'
		},
		controller: 'loginView'
	});
	$stateProvider.state('user', {
		type: 'profile',
		url: '/user/:userid',
		templateUrl: 'views/publicProfileView.html',
		controller: 'publicProfileView'
	});
	$stateProvider.state('card', {
		url: '/card/:cardid/:slug',
		templateUrl: 'views/cardView.html',
		controller: 'cardView'
	});
	$stateProvider.state('rules', {
		url: '/rules',
		title: 'Rules: Detailed for the game',
		description: 'Learn the rules before your play the game.',
		templateUrl: 'views/rulesView.html'
	});
	$stateProvider.state('top', {
		url: '/top',
		title: 'Top Cards: Favorites chosen by the community',
		description: 'Want to see everyone\'s favorite cards? See the most popular and the most controversial.',
		templateUrl: 'views/topView.html'
	});
	
	// Admin
	$stateProvider.state('admin', {
		url: '/admin',
		abstract: true,
		title: 'Admin',
		template: '<ui-view></ui-view>'
	});
	$stateProvider.state('admin.moderation', {
		url: '/moderation',
		title: 'Moderation',
		templateUrl: 'views/moderationView.html'
	});
	$stateProvider.state('admin.export', {
		url: '/export',
		title: 'Export',
		templateUrl: 'views/exportView.html',
		resolve: {
			getAllSuggestions: 'getAllSuggestions',
			allSets: function(sets) {
				return sets.getAllSets();
			}
		},
		controller: 'exportView'
	});

	$stateProvider.state('admin.sets', {
		url: '/sets',
		title: 'Sets',
		templateUrl: 'views/setsView.html',
		resolve: {
			allSets: function(sets) {
				return sets.getAllSets();
			}
		},
		controller: 'setsView'
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
			allSets: function(sets) {
				return sets.getAllSets();
			}
		},
		controller: 'setsDetailView'
	});

	$stateProvider.state('blog', {
		url: '/blog',
		title: 'Blog: News about the game and more',
		description: 'All the latest news about our game and our ramblings about our favorite games made by others.',
		templateUrl: 'views/blogView.html',
		resolve: {
			posts: ['prismic', function(prismic) {
				return prismic.getBlogPosts();
			}]
		},
		controller: 'blogView'
	});

	$stateProvider.state('blog.detail', {
		type: 'article',
		url: '/:id/:slug',
		templateUrl: 'views/blogDetailView.html',
		resolve: {
			post: ['$stateParams', 'prismic', function($stateParams, prismic) {
				return prismic.getDocumentById($stateParams.id);
			}]
		},
		controller: 'blogDetailView'
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
});