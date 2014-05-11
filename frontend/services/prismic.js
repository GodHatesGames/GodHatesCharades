'use strict';
app.service('prismic', function(Prismic, $q) {
	var cachedDocs = {};
	var prismicMethods = {
		getBlogPosts: _getBlogPosts,
		getDocumentById: _getDocumentById,
		linkResolver: _linkResolver
	};
	// console.log('instantiate sets');
	// Prismic.Api('https://godhatescharades.prismic.io/api', onApiConnected);

	function _getBlogPosts() {
		// Prismic.bookmark(bookmarkString)
		return Prismic.documentTypes('blog');
	}

	function _getDocumentById(id) {
		if (cachedDocs[id]) {
			// return cached document data if needed
			var deferred = $q.defer();
			deferred.resolve(cachedDocs[id]);
			return deferred.promise;
		} else {
			return Prismic.document(id)
			.then(function(document) {
				// cache the document data
				cachedDocs[document.id] = document;
				return document;
			});
		}
	}

	function _linkResolver(ctx, documentLink) {
	if (documentLink.isBroken) return;

	/* Based on document type of the document */
	if(documentLink.type == 'blog') {
	  return '/blog/' + documentLink.id + '/' + documentLink.slug + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');
	}
}


	return prismicMethods;
});