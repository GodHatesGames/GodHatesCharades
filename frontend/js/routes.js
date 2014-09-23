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

	$stateProvider.state('error', {
		url: '/error?message',
		title: 'Error accessing page',
		templateUrl: 'views/errorView.html',
		controller: 'errorView'
	});

	$stateProvider.state('home', {
		url: '/?vine&youtube',
		title: 'Your favorite new party game',
		description: 'A game where you act out the vile and despicable inside all of us. Talk, shout, and say awful things in the form of 30 second act outs.',
		templateUrl: 'views/homeView.html',
		controller: 'homeView'
	});

	$stateProvider.state('submit', {
		url: '/submit',
		title: 'Create: Suggest a new card',
		description: 'We need your help coming up with funny new cards. Submit your favorite ideas here.',
		templateUrl: 'views/submitView.html',
		resolve: {
			betaUser: ['parseUser', '$q', function(parseUser, $q) {
				if(parseUser.isBetaUser())
					return true;
				else
					return $q.reject({
						message: 'You must be a Backer to access this page. Please login.'
					});
			}]
		}
	});
	$stateProvider.state('vote', {
		url: '/vote',
		title: 'Vote: Help us choose new cards',
		description: 'Vote on cards submitted by other players to help us choose the best ones.',
		templateUrl: 'views/voteView.html',
		controller: 'voteView'
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
		controller: 'publicProfileView',
		resolve: {
			profile: ['parseUser', '$stateParams', function(parseUser, $stateParams) {
				return parseUser.getProfileById($stateParams.userid);
			}]
		}
	});
	$stateProvider.state('card', {
		url: '/card/:cardid/:slug',
		templateUrl: 'views/cardView.html',
		controller: 'cardView'
	});
	$stateProvider.state('pair', {
		url: '/pair/:pairid/:slug',
		templateUrl: 'views/pairView.html',
		controller: 'pairView',
		resolve: {
			pair: ['$stateParams', 'pairService', function($stateParams, pairService) {
				return pairService.getPairById($stateParams.pairid);
			}],
			readyForUpload: ['ytUploadService', function(ytUploadService) {
				return ytUploadService.waitForLoad();
			}]
		}
	});
	$stateProvider.state('rules', {
		url: '/rules',
		title: 'Rules: Detailed for the game',
		description: 'Learn the rules before your play the game.',
		templateUrl: 'views/rulesView.html',
		controller: 'rulesView',
		resolve: {
			rulesDoc: ['prismic', function(prismic) {
				return prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_RULES);
			}]
		}
	});
	$stateProvider.state('share', {
		url: '/share',
		title: 'Share: Help us spread the word!',
		description: 'Spread the word about God Hates Charades.',
		templateUrl: 'views/shareView.html',
		controller: 'shareView'
	});
	$stateProvider.state('top', {
		url: '/top',
		title: 'Top Cards: Favorites chosen by the community',
		description: 'Want to see everyone\'s favorite cards? See the most popular and the most controversial.',
		templateUrl: 'views/topView.html',
		controller: 'topView',
		abstract: true
	});
	$stateProvider.state('top.fame', {
		url: '/fame',
		title: 'Hall of Fame: Favorites chosen by the community',
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
		title: 'Hall of Shame: Most despised pairs chosen by the community',
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
		title: 'Controversial: Most loved and hated pairs chosen by the community',
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
			allSets: ['sets', function(sets) {
				return sets.getAllSets();
			}]
		},
		controller: 'exportView'
	});

	$stateProvider.state('admin.sets', {
		url: '/sets',
		title: 'Sets',
		templateUrl: 'views/setsView.html',
		resolve: {
			allSets: ['sets', function(sets) {
				return sets.getAllSets();
			}]
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
			allSets: ['sets', function(sets) {
				return sets.getAllSets();
			}]
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
	$stateProvider.state('fixme', {
		url: '/fixme',
		title: 'Fix yoself',
		description: 'If you\'re having account problems, you\'re in the right place',
		templateUrl: 'views/fixmeView.html',
		controller: 'fixmeView'
	});
	$stateProvider.state('reset', {
		url: '/reset',
		title: 'Lose something?',
		description: 'This is for people who lost their way...',
		templateUrl: 'views/resetPasswordView.html',
		controller: 'resetPasswordView'
	});

	$stateProvider.state('timeline', {
		url: '/timeline',
		title: 'Timeline: Our Kickstarter fufillment timeline',
		description: 'See our progress in shipping the game to our kickstarter backers!',
		templateUrl: 'views/timelineView.html',
		controller: 'timelineView'
	});
});