exports.Configuration = {

  apiEndpoint: process.env.PRISMIC_URL,

  // -- Access token if the Master is not open
  accessToken: process.env.PRISMIC_CLIENT_ACCESS_TOKEN,

  // OAuth
  // clientId: process.env.PRISMIC_CLIENT_ID,
  // clientSecret: process.env.PRISMIC_CLIENT_SECRET,

  // -- Links resolution rules
  linkResolver: function(doc) {
    if (doc.isBroken) return false;
    console.log(doc.getStructuredText('doc.content'));
    var slug = '/' + doc.getText('doc.slug')
    if(slug)
      return slug;
    else
      return '/';
  },

  // -- What to do in the event of an error from prismic.io
  onPrismicError: function(err, req, res) {
    res.send(500, "Error 500: " + err.message);
  }

};