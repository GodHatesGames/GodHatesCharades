'use strict';
app.service('prismic', function($q) {
	var deferred = $q.defer();
	var cachedDocs = {};
	var prismicMethods = {
		getBlogPosts: _getBlogPosts,
		getBlogPost: _getBlogPost,
		linkResolver: _linkResolver
	};
	// console.log('instantiate sets');
	var prismicApi;
	Prismic.Api('https://godhatescharades.prismic.io/api', onApiConnected);

	function onApiConnected(err, api) {
		prismicApi = api;
		deferred.resolve(prismicMethods);
	}

	function _getBlogPosts() {
		var deferred = $q.defer();

		// fetch all blog posts
		prismicApi
		.form('blog')
		.ref(prismicApi.master())
		.submit(function(err, documents) {
			if(err) {
				deferred.reject(err);
				return;
			}
			// add docs to cache
			_.each(documents.results, function(post, index) {
				if(post.id)
					cachedDocs[post.id] = post;
			});
			deferred.resolve(documents);
		});

		return deferred.promise;
	}

	function _getBlogPost(id) {
		var deferred = $q.defer();
		if (cachedDocs[id]) {
			deferred.resolve(cachedDocs[id]);
		} else {
			console.log('getBlogPost:', id);
			prismicApi
			.form('blog')
			.query('[[:d = at(document.id, "' + id + '")]]')
			.ref(prismicApi.master())
			.submit(function(err, documents) {
				if(err) {
					deferred.reject(err);
					return;
				}
				var post = documents.results[0];
				cachedDocs[post.id] = post;
				deferred.resolve(post);
			});
		}
		return deferred.promise;
	}

	function _linkResolver(ctx, documentLink) {
	if (documentLink.isBroken) return;

	/* Based on document type of the document */
	if(documentLink.type == 'blog') {
	  return '/blog/' + documentLink.id + '/' + documentLink.slug + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');
	}
}


	return deferred.promise;
});