'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('blog', {
		url: '/blog',
		title: 'Blog',
		description: 'All the latest news about our game and our ramblings about our favorite games made by others.',
		templateUrl: 'views/blog/blog.html',
		resolve: {
			posts: ['prismic', function(prismic) {
				return prismic.getBlogPosts();
			}]
		},
		controller: 'blogView'
	});
});