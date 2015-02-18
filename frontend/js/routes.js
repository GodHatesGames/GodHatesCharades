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
		description: 'A game where you act out the vile and despicable inside all of us. Talk, shout, and say awful things in the form of 30 second act outs.',
		templateUrl: 'views/homeView.html',
		controller: 'homeView'
	});

	$stateProvider.state('submit', {
		url: '/submit',
		title: 'Create',
		description: 'We need your help coming up with funny new cards. Submit your favorite ideas here.',
		templateUrl: 'views/submitView.html',
		resolve: {
			betaUser: ['User', '$q', function(User, $q) {
				if(User.current.beta)
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
		title: 'Vote',
		description: 'Vote on cards submitted by other players to help us choose the best ones.',
		templateUrl: 'views/voteView.html',
		controller: 'voteView'
	});
	$stateProvider.state('login', {
		url: '/login',
		title: 'Login',
		description: 'Join our community site and help us improve the game.',
		templateUrl: 'views/loginView.html',
		controller: 'loginView'
	});
	$stateProvider.state('user', {
		type: 'profile',
		url: '/user/:userid',
		templateUrl: 'views/publicProfileView.html',
		controller: 'publicProfileView',
		resolve: {
			publicProfile: ['Profile', '$stateParams', function(Profile, $stateParams) {
				return Profile.find($stateParams.userid);
			}]
		}
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
	$stateProvider.state('pair', {
		url: '/pair/:pairid/:slug',
		templateUrl: 'views/pairView.html',
		controller: 'pairView',
		resolve: {
			pair: ['$stateParams', 'Pair', function($stateParams, Pair) {
				return Pair.find($stateParams.pairid);
			}],
			readyForUpload: ['ytUploadService', function(ytUploadService) {
				return ytUploadService.waitForLoad();
			}]
		}
	});
	$stateProvider.state('rules', {
		url: '/rules',
		title: 'Rules',
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
		title: 'Share',
		description: 'Spread the word about God Hates Charades.',
		templateUrl: 'views/shareView.html',
		controller: 'shareView'
	});
	$stateProvider.state('top', {
		url: '/top',
		title: 'Top Pairs',
		description: 'Want to see everyone\'s favorite cards? See the most popular and the most controversial.',
		templateUrl: 'views/topView.html',
		controller: 'topView',
		abstract: true
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
	
	$stateProvider.state('admin.moderation', {
		url: '/moderation',
		title: 'Moderation',
		templateUrl: 'views/moderationView.html',
		resolve: {
			unmoderated: ['Suggestion', function(Suggestion) {
				return Suggestion.getUnmoderatedSuggestions();
			}],
			approved: ['Suggestion', function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			}],
			sets: ['Set', function(Set) {
				return Set.findAll();
			}]
		},
		controller: 'moderationView'
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

	$stateProvider.state('admin.suggestions', {
		url: '/suggestions',
		title: 'Suggestions',
		templateUrl: 'views/suggestionsView.html',
		resolve: {
			suggestions: ['Suggestion', function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			}],
			sets: ['Set', function(Set) {
				return Set.findAll();
			}]
		},
		controller: 'suggestionsView'
	});

	$stateProvider.state('admin.sets', {
		url: '/sets',
		title: 'Sets',
		templateUrl: 'views/setsView.html',
		resolve: {
			sets: ['Set', function(Set) {
				return Set.findAll();
			}],
			suggestions: ['Suggestion', function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
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
		title: 'Timeline',
		description: 'See our progress in shipping the game to our kickstarter backers!',
		templateUrl: 'views/timelineView.html',
		controller: 'timelineView',
		resolve: {
			timelineDoc: ['prismic', function(prismic) {
				return prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_TIMELINE);
			}]
		}
	});

	// $stateProvider.state('watch', {
	// 	url: '/watch',
	// 	title: 'Watch',
	// 	description: 'Watch people make fools out of themselves on the internet!',
	// 	templateUrl: 'views/watchView.html',
	// 	controller: 'watchView',
	// 	resolve: {
	// 		readyForUpload: ['ytUploadService', function(ytUploadService) {
	// 			return ytUploadService.waitForLoad();
	// 		}],
	// 		ghcVids:['Restangular', function(Restangular) {
	// 			var params = {
	// 				part: 'snippet',
	// 				key: CONFIG.YOUTUBE.key,
	// 				q: 'I just acted out a scene from God Hates Charades',
	// 				type: 'video',
	// 				order: 'date'
	// 			}
	// 			return Restangular.oneUrl('ghcVids', 'https://www.googleapis.com/youtube/v3/').one('search').get(params);
	// 		}]
	// 	}
	// });
});