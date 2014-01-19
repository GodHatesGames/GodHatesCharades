angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('frontend/components/card.html',
    "<div class=\"card\" ng-class=\"typeClass\">\n" +
    "\t<div class=\"cardContent\">\n" +
    "\t\t{{card.attributes.text}}\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/cardInfo.html',
    "<div class=\"cardInfo well\">\n" +
    "\t<p>\n" +
    "\t\t{{typeDisplay}} Card<br>\n" +
    "\t\t<ng-pluralize count=\"totalVotes\" when=\"{'0': 'No votes.',\n" +
    "\t\t\t\t\t'one': '1 pity vote',\n" +
    "\t\t\t\t\t'other': '{{totalVotes}} votes'}\">\n" +
    "\t\t</ng-pluralize>\n" +
    "\t\t<br>\n" +
    "\t\t<ng-pluralize count=\"totalSkips\" when=\"{'0': 'No skips.',\n" +
    "\t\t\t\t\t'one': '1 measly skip',\n" +
    "\t\t\t\t\t'other': '{{totalVotes}} skips'}\">\n" +
    "\t\t</ng-pluralize>\n" +
    "\t\t<br>\n" +
    "\t\t{{kdr}} KDR\n" +
    "\t\t<br>\n" +
    "\t\tSubmitted by <a ui-sref=\"user({userid: cardOwnerId})\"><b>{{cardOwnerName}}</b></a>\n" +
    "\t\t<br>\n" +
    "\t\t<a ui-sref=\"card({cardid: id})\">More stats</a>\n" +
    "\t</p>\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/examples.html',
    "<div class=\"examplesContainer\" ng-class=\"{'loading': loading}\">\n" +
    "\t <!-- Character -->\n" +
    "\t<div class=\"characters\">\n" +
    "\t\t<div class=\"card character\" ng-class=\"cardClass(index)\" ng-repeat=\"(index, suggestion) in characters\">\n" +
    "\t\t\t<div class=\"cardContent\">\n" +
    "\t\t\t\t{{suggestion.attributes.text}}\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<!-- Scenario -->\n" +
    "\t<div class=\"scenarios\">\n" +
    "\t\t<div class=\"card scenario\" ng-class=\"cardClass(index)\" ng-repeat=\"(index, suggestion) in scenarios\">\n" +
    "\t\t\t<div class=\"cardContent\">\n" +
    "\t\t\t\t{{suggestion.attributes.text}}\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/login.html',
    "<form ng-submit=\"login()\" class=\"login\">\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"loginEmail\">Email</label>\n" +
    "\t\t<input type=\"email\" class=\"form-control\" id=\"loginEmail\" ng-model=\"email\" placeholder=\"janedoe@gmail.com\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"loginPassword\">Password</label>\n" +
    "\t\t<input type=\"password\" class=\"form-control\" id=\"loginPassword\" ng-model=\"password\" placeholder=\"Password\">\n" +
    "\t</div>\n" +
    "\t<button type=\"submit\" class=\"btn btn-success\">Welcome back</button>\n" +
    "</form>"
  );


  $templateCache.put('frontend/components/moderator.html',
    "<div class=\"moderator\">\n" +
    "\t<link rel=\"stylesheet\" type=\"text/css\" href=\"components/moderator.css\">\n" +
    "\n" +
    "\t<div class=\"alert alert-info\" ng-show=\"loading\">\n" +
    "\t\tLoading...</div>\n" +
    "\n" +
    "\t<div class=\"alert alert-info\" ng-show=\"allApproved && !loading && !errorMessage\">\n" +
    "\t\tThats all folks... dont you have something better you could be doing?\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"alert alert-danger\" ng-show=\"errorMessage\">\n" +
    "\t\tUh oh! {{errorMessage}}\n" +
    "\t</div>\n" +
    "\n" +
    "\t<p ng-show=\"!allApproved && !loading\">Try not to fuck this up</p>\n" +
    "\n" +
    "\t<!-- One suggestion at a time -->\n" +
    "\t<div class=\"cardContainer\" ng-hide=\"loading || allApproved || !suggestion\">\n" +
    "\n" +
    "\t\t<hr>\n" +
    "\t\t<card id=\"suggestion.id\" updatable=\"true\"></card>\n" +
    "\t\t<form class=\"form-horizontal\" role=\"form\">\n" +
    "\t\t\t<div class=\"form-group\">\n" +
    "\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t<div class=\"radio col-md-3\">\n" +
    "\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t<input class=\"legal\" type=\"radio\" ng-model=\"legalMod\" value=\"\">\n" +
    "\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"radio col-md-3\">\n" +
    "\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t<input class=\"legal\" type=\"radio\" ng-model=\"legalMod\" value=\"©\">\n" +
    "\t\t\t\t\t\t\t&copy;\n" +
    "\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"radio col-md-3\">\n" +
    "\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t<input class=\"legal\" type=\"radio\" ng-model=\"legalMod\" value=\"™\">\n" +
    "\t\t\t\t\t\t\t&trade;\n" +
    "\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"radio col-md-3\">\n" +
    "\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t<input class=\"legal\" type=\"radio\" ng-model=\"legalMod\" value=\"®\">\n" +
    "\t\t\t\t\t\t\t&reg;\n" +
    "\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"form-group\">\n" +
    "\t\t\t\t<label for=\"suggestionText\">New Text</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"suggestionText\" ng-model=\"suggestionText\">\n" +
    "\t\t\t</div>\n" +
    "\t\t</form>\n" +
    "\t\t<button class=\"btn btn-success\" ng-click=\"approve()\">\n" +
    "\t\t\tApprove &amp; Save\n" +
    "\t\t</button>\n" +
    "\t\t<button class=\"btn btn-danger\" ng-click=\"disapprove()\">\n" +
    "\t\t\tDisapprove\n" +
    "\t\t</button>\n" +
    "\t\t<button ng-click=\"skip()\" class=\"btn btn-warning skip\">\n" +
    "\t\t\tAsk me later\n" +
    "\t\t</button>\n" +
    "\t</div>\n" +
    "\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/nav.html',
    "<ul class=\"nav nav-pills nav-justified\" id=\"mainNav\" ng-show=\"parseUser.isBetaUser()\">\n" +
    "\n" +
    "\t<!-- universal nav -->\n" +
    "\t<li ng-class=\"{ active: $state.includes('rules') }\">\n" +
    "\t\t<a ui-sref=\"rules\">Rules</a>\n" +
    "\t</li>\n" +
    "\t<li ng-class=\"{ active: $state.includes('submit') }\">\n" +
    "\t\t<a ui-sref=\"submit\">Submit</a>\n" +
    "\t</li>\n" +
    "\t<li ng-class=\"{ active: $state.includes('vote') }\">\n" +
    "\t\t<a ui-sref=\"vote\">Vote</a>\n" +
    "\t</li>\n" +
    "\t<li ng-class=\"{ active: $state.includes('top') }\">\n" +
    "\t\t<a ui-sref=\"top\">Leaderboard</a>\n" +
    "\t</li>\n" +
    "\n" +
    "\t<!-- user stuff -->\n" +
    "\t<li class=\"dropdown\" ng-hide=\"parseUser.isAnon()\">\n" +
    "\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "\t\t\t{{parseUser.data.attributes.name}}\n" +
    "\t\t\t<b class=\"caret\"></b>\n" +
    "\t\t</a>\n" +
    "\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t<li>\n" +
    "\t\t\t\t<a ui-sref=\"user({userid: parseUser.data.id})\" ng-class=\"{ active: $state.includes('profile') }\">\n" +
    "\t\t\t\t\tMy Profile\n" +
    "\t\t\t\t</a>\n" +
    "\t\t\t</li>\n" +
    "\n" +
    "\t\t\t<!-- Admin section -->\n" +
    "\t\t\t<li role=\"presentation\" class=\"divider\" ng-show=\"parseUser.isAdmin()\"></li>\n" +
    "\t\t\t<li role=\"presentation\" class=\"dropdown-header\" ng-show=\"parseUser.isAdmin()\">\n" +
    "\t\t\t\tAdmin\n" +
    "\t\t\t</li>\n" +
    "\t\t\t<li ng-class=\"{ active: $state.includes('moderation') }\" ng-show=\"parseUser.isAdmin()\">\n" +
    "\t\t\t\t<a ui-sref=\"admin.moderation\">Moderation</a>\n" +
    "\t\t\t</li>\n" +
    "\t\t\t<li ng-class=\"{ active: $state.includes('print') }\" ng-show=\"parseUser.isAdmin()\">\n" +
    "\t\t\t\t<a ui-sref=\"admin.print\">Print</a>\n" +
    "\t\t\t</li>\n" +
    "\n" +
    "\t\t\t<li role=\"presentation\" class=\"divider\"></li>\n" +
    "\t\t\t<!-- logout -->\n" +
    "\t\t\t<li>\n" +
    "\t\t\t\t<a ng-click=\"parseUser.logout()\">Logout</a>\n" +
    "\t\t\t</li>\n" +
    "\t\t</ul>\n" +
    "\t</li>\n" +
    "\t\n" +
    "\t<li class=\"login\" ng-class=\"{ active: $state.includes('login') }\" ng-show=\"parseUser.isAnon()\">\n" +
    "\t\t<a ui-sref=\"login\">\n" +
    "\t\t\tLogin\n" +
    "\t\t</a>\n" +
    "\t</li>\n" +
    "</ul>"
  );


  $templateCache.put('frontend/components/printer.html',
    "<div class=\"printer\">\n" +
    "\t<link rel=\"stylesheet\" type=\"text/css\" href=\"components/printer.css\">\n" +
    "\n" +
    "\t<div class=\"alert alert-info\" ng-show=\"loading\">\n" +
    "\t\tLoading, this may take a while...</div>\n" +
    "\n" +
    "\t<div class=\"alert alert-success\" ng-show=\"!loading && !errorMessage\">\n" +
    "\t\t{{suggestions.length}} cards loaded, start printing!\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"alert alert-danger\" ng-show=\"errorMessage\">\n" +
    "\t\tUh oh! {{errorMessage}}\n" +
    "\t</div>\n" +
    "\n" +
    "\t<!-- One suggestion at a time -->\n" +
    "\t<div class=\"cardContainer\" ng-hide=\"loading || allApproved || !suggestions\">\n" +
    "\n" +
    "\t\t<div class=\"card page-break\" ng-repeat=\"(index, suggestion) in suggestions | orderBy:'attributes.type'\" ng-class=\"cardService.getTypeClass(suggestion)\">\n" +
    "\t\t\t<div class=\"cardContent\">\n" +
    "\t\t\t\t{{suggestion.attributes.text}}\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/signup.html',
    "<form ng-submit=\"signup()\" class=\"signup form-horizontal\" role=\"form\">\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"signupName\" class=\"control-label col-sm-3 col-md-3 col-lg-2\">\n" +
    "\t\t\tName\n" +
    "\t\t</label>\n" +
    "\t\t<div class=\"col-sm-9 col-md-9 col-lg-10\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" id=\"signupName\" ng-model=\"name\" placeholder=\"PlainJane\" required>\n" +
    "\t\t\t<span class=\"help-block\">Other people will see this on your entries.</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"signupEmail\" class=\"control-label col-sm-3 col-md-3 col-lg-2\">\n" +
    "\t\t\tEmail\n" +
    "\t\t</label>\n" +
    "\t\t<div class=\"col-sm-9 col-md-9 col-lg-10\">\n" +
    "\t\t\t<input type=\"email\" class=\"form-control\" id=\"signupEmail\" ng-model=\"email\" placeholder=\"janedoe@gmail.com\" required>\n" +
    "\t\t\t<span class=\"help-block\">Just for logging in. Never shared, never sold.</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"signupPassword\" class=\"control-label col-sm-3 col-md-3 col-lg-2\">\n" +
    "\t\t\tPassword\n" +
    "\t\t</label>\n" +
    "\t\t<div class=\"col-sm-9 col-md-9 col-lg-10\">\n" +
    "\t\t\t<input type=\"password\" class=\"form-control\" id=\"signupPassword\" ng-model=\"password\" placeholder=\"donthackmebro\" required>\n" +
    "\t\t\t<span class=\"help-block\">Always use protection!</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<button type=\"submit\" class=\"btn btn-success\">Signup!</button>\n" +
    "</form>"
  );


  $templateCache.put('frontend/components/submit.html',
    "<div class=\"submit\">\n" +
    "\t<h4>{{typeDisplay}}</h4>\n" +
    "\t<div class=\"cardContainer\" ng-hide=\"success\">\n" +
    "\t\t<div class=\"card\" ng-class=\"typeClass\">\n" +
    "\t\t\t<div class=\"submitForm cardContent\">\n" +
    "\t\t\t\t\t<!-- <input type=\"text\" \n" +
    "\t\t\t\t\t\t\tng-model=\"text\" \n" +
    "\t\t\t\t\t\t\tplaceholder=\"{{example}}\" /> -->\n" +
    "\t\t\t\t\t<textarea ng-model=\"text\" class=\"editable\" placeholder=\"{{example}}\" maxlength=\"75\" required textarea-noreturn=\"\">\n" +
    "\t\t\t\t\t</textarea>\n" +
    "\t\t\t\t\t<!-- <div contentEditable=\"true\"\n" +
    "\t\t\t\t\t\t\tclass=\"editable\" \n" +
    "\t\t\t\t\t\t\tng-model=\"text\"\n" +
    "\t\t\t\t\t\t\t></div> -->\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"alert\" ng-class=\"characterCount()\">\n" +
    "\t\t\t{{text.length}} / {{maxChars}} Characters\n" +
    "\t\t</div>\n" +
    "\t\t<button type=\"submit\" class=\"btn btn-success submit\" ng-disabled=\"text.length == 0\" ng-click=\"submit()\">\n" +
    "\t\t\tSubmit {{typeDisplay}}\n" +
    "\t\t</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"cardContainer\" ng-show=\"success\">\n" +
    "\t\t\t<div class=\"card submitted\" ng-class=\"typeClass\">\n" +
    "\t\t\t\t<div class=\"cardContent\">\n" +
    "\t\t\t\t\t<h5>Thanks for the submission<b>{{displayName()}}</b>! Your card will be up soon.</h5>\n" +
    "\t\t\t\t\t<p ng-hide=\"parseUser.loggedin\">\n" +
    "\t\t\t\t\t\tWant to people to know how brilliant you are? Signup and we'll credit your name or nickname on the card!\n" +
    "\t\t\t\t\t</p>\n" +
    "\t\t\t\t<a ui-sref=\"login\" class=\"btn btn-success\" ng-hide=\"parseUser.loggedin\">\n" +
    "\t\t\t\t\tSignup Now\n" +
    "\t\t\t\t</a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<button ng-click=\"reset()\" class=\"btn btn-info\">\n" +
    "\t\t\t\tCreate a new Card\n" +
    "\t\t\t</button>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/topSubmissions.html',
    "<div class=\"topSubmissions\">\n" +
    "\t<ul class=\"nav nav-pills subnav\">\n" +
    "\t\t<li ng-class=\"{ active: tab == 'best' }\">\n" +
    "\t\t\t<a ng-click=\"reloadSuggestions('best')\">\n" +
    "\t\t\t\tHall of Fame\n" +
    "\t\t\t</a>\n" +
    "\t\t</li>\n" +
    "\t\t<li ng-class=\"{ active: tab == 'worst' }\">\n" +
    "\t\t\t<a ng-click=\"reloadSuggestions('worst')\">\n" +
    "\t\t\t\tHall of Shame\n" +
    "\t\t\t</a>\n" +
    "\t\t</li>\n" +
    "\t\t<li ng-class=\"{ active: tab == 'controversial' }\">\n" +
    "\t\t\t<a ng-click=\"reloadSuggestions('controversial')\">\n" +
    "\t\t\t\tControversial\n" +
    "\t\t\t</a>\n" +
    "\t\t</li>\n" +
    "\t</ul>\n" +
    "\t<div class=\"suggestionList\" ng-hide=\"loading && skipIndex == 0\" infinite-scroll=\"loadSuggestions()\" infinite-scroll-disabled=\"loading\" infinite-scroll-immediate-check=\"true\">\n" +
    "\t\t\t<table class=\"table\">\n" +
    "\t\t\t\t<tr>\n" +
    "\t\t\t\t\t<th>Rank</th>\n" +
    "\t\t\t\t\t<th>Suggestion</th>\n" +
    "\t\t\t\t\t<th>Votes</th>\n" +
    "\t\t\t\t\t<th>Skips</th>\n" +
    "\t\t\t\t\t<th>Viewed</th>\n" +
    "\t\t\t\t\t<th>Submitter</th>\n" +
    "\t\t\t\t\t<th>Type</th>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tr ng-repeat=\"(index, suggestion) in suggestions\">\n" +
    "\t\t\t\t\t<td ng-bind=\"index + 1\"></td>\n" +
    "\t\t\t\t\t<!-- Text -->\n" +
    "\t\t\t\t\t<td ng-bind=\"suggestion.attributes.text\"></td>\n" +
    "\t\t\t\t\t<!-- Votes -->\n" +
    "\t\t\t\t\t<td ng-show=\"suggestion.attributes.totalVotes\">\n" +
    "\t\t\t\t\t\t{{suggestion.attributes.totalVotes | number}}\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td ng-hide=\"suggestion.attributes.totalVotes\">0</td>\n" +
    "\t\t\t\t\t<!-- Skips -->\n" +
    "\t\t\t\t\t<td ng-show=\"suggestion.attributes.skipped\">\n" +
    "\t\t\t\t\t\t{{suggestion.attributes.skipped | number}}\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td ng-hide=\"suggestion.attributes.skipped\">0</td>\n" +
    "\t\t\t\t\t<!-- Views -->\n" +
    "\t\t\t\t\t<td ng-bind=\"suggestion.attributes.skipped + suggestion.attributes.totalVotes\"></td>\n" +
    "\t\t\t\t\t<!-- Submitter -->\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<a ui-sref=\"user({userid: suggestion.attributes.owner.id})\">\n" +
    "\t\t\t\t\t\t\t{{suggestion.attributes.owner.attributes.name}}\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<!-- Type -->\n" +
    "\t\t\t\t\t<td ng-class=\"cardService.getTypeClass(suggestion)\"></td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</table>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"loadingAlert\" ng-show=\"loading\">\n" +
    "\t\tLoading...\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/userSubmissions.html',
    "<div>\n" +
    "\t<h2>Submissions from {{user.attributes.name || '...'}}</h2>\n" +
    "\t<hr>\n" +
    "\n" +
    "\t<div class=\"suggestionList\" ng-hide=\"loading && skipIndex == 0\" infinite-scroll=\"loadSuggestions()\" infinite-scroll-disabled=\"loading\" infinite-scroll-immediate-check=\"true\">\n" +
    "\t\t\t<table class=\"table\">\n" +
    "\t\t\t\t<tr>\n" +
    "\t\t\t\t\t<th>Rank</th>\n" +
    "\t\t\t\t\t<th>Suggestion</th>\n" +
    "\t\t\t\t\t<th>Votes</th>\n" +
    "\t\t\t\t\t<th>Skips</th>\n" +
    "\t\t\t\t\t<th>Viewed</th>\n" +
    "\t\t\t\t\t<th>Type</th>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tr ng-repeat=\"(index, suggestion) in suggestions\">\n" +
    "\t\t\t\t\t<td ng-bind=\"index + 1\"></td>\n" +
    "\t\t\t\t\t<!-- Text -->\n" +
    "\t\t\t\t\t<td ng-bind=\"suggestion.attributes.text\"></td>\n" +
    "\t\t\t\t\t<!-- Votes -->\n" +
    "\t\t\t\t\t<td ng-show=\"suggestion.attributes.totalVotes\">\n" +
    "\t\t\t\t\t\t{{suggestion.attributes.totalVotes | number}}\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td ng-hide=\"suggestion.attributes.totalVotes\">0</td>\n" +
    "\t\t\t\t\t<!-- Skips -->\n" +
    "\t\t\t\t\t<td ng-show=\"suggestion.attributes.skipped\">\n" +
    "\t\t\t\t\t\t{{suggestion.attributes.skipped | number}}\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td ng-hide=\"suggestion.attributes.skipped\">0</td>\n" +
    "\t\t\t\t\t<!-- Views -->\n" +
    "\t\t\t\t\t<td ng-bind=\"suggestion.attributes.skipped + suggestion.attributes.totalVotes\"></td>\n" +
    "\t\t\t\t\t<!-- Type -->\n" +
    "\t\t\t\t\t<td ng-class=\"cardService.getTypeClass(suggestion)\"></td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</table>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"loadingAlert\" ng-show=\"loading\">\n" +
    "\t\tLoading...\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/userinfo.html',
    "<div class=\"userinfo\">\n" +
    "\t<div ng-hide=\"loading || error\">\n" +
    "\t\t<p class=\"form-control-static\">{{user.attributes.name}}</p>\n" +
    "\t\t<p class=\"form-control-static\">{{user.attributes.email}}</p>\n" +
    "\t</div>\n" +
    "\t<div ng-show=\"error\">\n" +
    "\t\t<p>Damn, this user could not be found.</p>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/components/vote.html',
    "<div class=\"vote\">\n" +
    "\t<link rel=\"stylesheet\" type=\"text/css\" href=\"components/vote.css\">\n" +
    "\n" +
    "\t<div class=\"loadingAlert\" ng-show=\"loading\">\n" +
    "\t\tLoading...</div>\n" +
    "\n" +
    "\t<!-- Repeat Pairs -->\n" +
    "\t<div class=\"cardsContainer\">\n" +
    "\t\t<div class=\"pairContainer\" ng-repeat=\"(index, pair) in suggestionPairs\" ng-hide=\"loading\" ng-click=\"selectPair(index)\">\n" +
    "\t\t\t<!-- Repeat suggestions in pairs -->\n" +
    "\t\t\t\t<div class=\"card\" ng-repeat=\"(index, suggestion) in pair\" ng-class=\"cardService.getTypeClass(suggestion)\">\n" +
    "\t\t\t\t\t<div class=\"cardContent\">\n" +
    "\t\t\t\t\t\t{{suggestion.attributes.text}}\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t<div class=\"separator\" ng-hide=\"$last\">\n" +
    "\t\t\t\tVS\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<!-- Skip button -->\n" +
    "\n" +
    "\t<p ng-hide=\"loading\">...or let us know if both suck.</p>\n" +
    "\t<button ng-click=\"skipBoth()\" ng-hide=\"loading\" class=\"btn skip\">\n" +
    "\t\tThese aren't funny\n" +
    "\t</button>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/cardView.html',
    "<div id=\"cardView row\">\n" +
    "\t<div class=\"col-md-4\">\n" +
    "\t\t<card id=\"cardid\"></card>\n" +
    "\t\t<card-info id=\"cardid\"></card-info>\n" +
    "\t</div>\n" +
    "\t<div class=\"col-md-8\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<h3>Share it</h3>\n" +
    "\t\t\t<!-- AddThis Button BEGIN -->\n" +
    "\t\t\t<div class=\"addthis_toolbox addthis_default_style\">\n" +
    "\t\t\t\t<a class=\"addthis_button_facebook_like\" fb:like:layout=\"button_count\"></a>\n" +
    "\t\t\t\t<a class=\"addthis_button_tweet\"></a>\n" +
    "\t\t\t\t<a class=\"addthis_button_linkedin_counter\"></a>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- AddThis Button END -->\n" +
    "\t\t</div>\n" +
    "\t\t<hr>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<h3>Love it or troll it</h3>\n" +
    "\t\t\t<div id=\"disqus_thread\"></div>\n" +
    "\t\t\t<a href=\"http://disqus.com\" class=\"dsq-brlink\">comments powered by <span class=\"logo-disqus\">Disqus</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/homeView.html',
    "<div id=\"homeView\">\n" +
    "\n" +
    "\t<div class=\"row\" id=\"kickstarter\">\n" +
    "\t\t<!-- Kickstarter -->\n" +
    "\t\t<span ng-hide=\"kickstarter.done()\">\n" +
    "\t\t\t<h3>Our <span class=\"kickstarter\">Kickstarter</span> is coming soon!</h3>\n" +
    "\t\t\t<!-- <p>. You can help us now by signing up to be notified.</p> -->\n" +
    "\t\t\t<timer countdown=\"kickstarter.deadline() / 1000\" interval=\"1000\" class=\"row\">\n" +
    "\t\t\t\t<div class=\"col-xs-3 col-sm-offset-2 col-sm-2 col-md-offset-2 col-md-2 col-lg-offset-2 col-lg-2\">\n" +
    "\t\t\t\t\t<div class=\"timerNumber\">{{days}}</div>\n" +
    "\t\t\t\t\t<div class=\"timerText\">days</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"col-xs-3 col-sm-2 col-md-2 col-lg-2\">\n" +
    "\t\t\t\t\t<div class=\"timerNumber\">{{hours}}</div>\n" +
    "\t\t\t\t\t<div class=\"timerText\">hours</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"col-xs-3 col-sm-2 col-md-2 col-lg-2\">\n" +
    "\t\t\t\t\t<div class=\"timerNumber\">{{minutes}}</div>\n" +
    "\t\t\t\t\t<div class=\"timerText\">minutes</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"col-xs-3 col-sm-2 col-md-2 col-lg-2\">\n" +
    "\t\t\t\t\t<div class=\"timerNumber\">{{seconds}}</div>\n" +
    "\t\t\t\t\t<div class=\"timerText\">seconds</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</timer>\n" +
    "\t\t</span>\n" +
    "\t\t<span ng-show=\"kickstarter.done()\">\n" +
    "\t\t\t<h3>Are you as excited as us?!</h3>\n" +
    "\t\t\t<p>Our kickstarter launched and we need your support the most!</p>\n" +
    "\t\t\t<a href=\"http://www.kickstarter.com\" class=\"btn btn-inverted\" target=\"_blank\">Back us</a>\n" +
    "\t\t</span>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<!-- Begin MailChimp Signup Form -->\n" +
    "\t<div id=\"mc_embed_signup\" class=\"row\">\n" +
    "\t\t<span>\n" +
    "\t\t\t<h3 ng-hide=\"kickstarter.done()\">\n" +
    "\t\t\t\tBe the first to hear about our launch!\n" +
    "\t\t\t</h3>\n" +
    "\t\t\t<h3 ng-show=\"kickstarter.done()\">\n" +
    "\t\t\t\tKeep up to date with us!\n" +
    "\t\t\t</h3>\n" +
    "\t\t\t<form action=\"http://godhatescharades.us3.list-manage.com/subscribe/post?u=88c52ae3a3f740d6ede2fcc05&amp;id=b6575d0e61\" method=\"post\" id=\"mc-embedded-subscribe-form\" name=\"mc-embedded-subscribe-form\" target=\"_blank\" class=\"form-inline\" novalidate>\n" +
    "\t\t\t\t<div class=\"form-group\">\n" +
    "\t\t\t\t\t<label for=\"mce-EMAIL\" class=\"sr-only\">\n" +
    "\t\t\t\t\t\tEmail Address\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<input type=\"email\" value=\"\" name=\"EMAIL\" class=\"required email\" id=\"mce-EMAIL\" placeholder=\"Enter email\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<input type=\"submit\" value=\"Subscribe\" name=\"subscribe\" id=\"mc-embedded-subscribe\" class=\"btn btn-success\">\n" +
    "\t\t\t\t<!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->\n" +
    "\t\t\t\t<div style=\"position: absolute; left: -5000px\"><input type=\"text\" name=\"b_88c52ae3a3f740d6ede2fcc05_b6575d0e61\" value=\"\"></div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</span>\n" +
    "\t</div>\n" +
    "\t<!--End mc_embed_signup-->\n" +
    "\n" +
    "\t<h2>A game where you act out the vile and despicable inside all of us.</h2>\n" +
    "\t<h5>God Hates Charades is a game where you can talk, shout, and say vile things in the form of 30 second act outs.</h5>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<examples></examples>\n" +
    "\t</div>\n" +
    "\t<hr>\n" +
    "\t<div class=\"row rules\">\n" +
    "\t\t<div class=\"col-md-4\">\n" +
    "\t\t\t<h4>The<br><b>Actor</b></h4>\n" +
    "\t\t\t<!-- <div class=\"thumbnail actor\"></div> -->\n" +
    "\t\t\t<p>A player will assume the actor position. Their job will be to <b>act out the scene</b> given to them by one of the other players.</p>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"col-md-4\">\n" +
    "\t\t\t<h4>The<br><b>Guesser</b></h4>\n" +
    "\t\t\t<!-- <div class=\"thumbnail guesser\"></div> -->\n" +
    "\t\t\t<p>All players who aren’t acting are guessers. Their job is to <b>guess what the actor is doing</b> unless the actor picks your scene. If the actor picks your scene you become the God player.</p>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"col-md-4\">\n" +
    "\t\t\t<h4>The<br><b>God</b></h4>\n" +
    "\t\t\t<!-- <div class=\"thumbnail god\"></div> -->\n" +
    "\t\t\t<p>As the God player their job is to <b>throw off the other players</b> by making stupid guesses and just causing problems. After all God Hates Charades.</p>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/loginView.html',
    "<div id=\"loginView\">\n" +
    "\t<span ng-hide=\"parseUser.isReal()\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<!-- left side -->\n" +
    "\t\t\t<h3 class=\"col-sm-6\">\n" +
    "\t\t\t\tCreate a new account\n" +
    "\t\t\t</h3>\n" +
    "\n" +
    "\t\t\t<!-- right side -->\n" +
    "\t\t\t<h3 class=\"col-sm-6\">\n" +
    "\t\t\t\tLogin\n" +
    "\t\t\t</h3>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<!-- left side -->\n" +
    "\t\t\t<signup class=\"col-sm-6 col-md-6 col-lg-6\"></signup>\n" +
    "\n" +
    "\t\t\t<!-- right side -->\n" +
    "\t\t\t<login class=\"col-sm-6 col-md-6 col-lg-6\"></login>\n" +
    "\t\t</div>\n" +
    "\t</span>\n" +
    "\t<span ng-show=\"parseUser.isReal()\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<h3 class=\"col-sm-6\">\n" +
    "\t\t\t\tYou're logged in\n" +
    "\t\t\t</h3>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<userinfo class=\"col-sm-12\" userid=\"parseUser.data.id\">\n" +
    "\t\t\t</userinfo>\n" +
    "\t\t</div>\n" +
    "\t</span>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/moderationView.html',
    "<div id=\"moderationView\">\n" +
    "\t<h2>Moderation</h2>\n" +
    "\t<hr>\n" +
    "\t<moderator></moderator>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/printView.html',
    "<div id=\"printView\">\n" +
    "\t<h2>Print</h2>\n" +
    "\t<hr>\n" +
    "\t<printer></printer>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/publicProfileView.html',
    "<div id=\"publicProfileView\">\n" +
    "\t<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"css/profileView.css\"> -->\n" +
    "\t<user-submissions userid=\"userid\"></user-submissions>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/rulesView.html',
    "<div id=\"rulesView\">\n" +
    "\t<link rel=\"stylesheet\" type=\"text/css\" href=\"views/rulesView.css\">\n" +
    "\t<h2>What is God Hates Charades?</h2>\n" +
    "\t<hr>\n" +
    "\t\n" +
    "\t<p>God Hates Charades is a game where you can talk, shout, and say vile things in the form of 30 second act outs.</p>\n" +
    "\n" +
    "\t<h3>Roles</h3>\n" +
    "\n" +
    "\t<p>Players take on three roles during the game.</p>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"col-md-4\">\n" +
    "\t\t\t<h4>The Actor</h4>\n" +
    "\t\t\t<div class=\"thumbnail actor\"></div>\n" +
    "\t\t\tA player will assume the actor position. Their job will be to <b>act out the scene</b> given to them by one of the other players.\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"col-md-4\">\n" +
    "\t\t\t<h4>The Guesser</h4>\n" +
    "\t\t\t<div class=\"thumbnail guesser\"></div>\n" +
    "\t\t\tAll players who aren’t acting are guessers. Their job is to <b>guess what the actor is doing</b> unless the actor picks your scene. If the actor picks your scene you become the God player.\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"col-md-4\">\n" +
    "\t\t\t<h4>God</h4>\n" +
    "\t\t\t<div class=\"thumbnail god\"></div>\n" +
    "\t\t\tAs the God player their job is to <b>throw off the other players</b> by making stupid guesses and just causing problems. After all God Hates Charades.\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<h3>Quick Rules</h3>\n" +
    "\n" +
    "\t<p>An actor may not say any words printed on the card while doing their act out.</p>\n" +
    "\n" +
    "\t<p>An actor may not say any words that are synonyms of words printed on the card.</p>\n" +
    "\n" +
    "\t<p>The God player gets to determine if a guess from a player counts or not. It is recommended to play by the “Jist” rules. Advanced players can play by the more “strict” rules.</p>\n" +
    "\n" +
    "\t<h3>Winning</h3>\n" +
    "\n" +
    "\t<p>Play takes place in two rounds.</p>\n" +
    "\n" +
    "\t<p>The first round is called the “general round”. In this round players act, guess, and mislead each other until two or more player have captured 7 points. Each player has 30 seconds to act out their scene.</p>\n" +
    "\n" +
    "\t<p>The second round is called the “lighting round”. In this round the players with 6 points do a series of act outs. The other players act as the guessers. Each of the 6 point players continuously act out scenes drawn at random until one player can’t get the other players to guess their scene. During this round each guess an actor gets counts as a point. Each person who guesses correctly also gets a point.</p>\n" +
    "\n" +
    "\t<p>The winner is the player with the most points. In most cases this the actor who didn’t get eliminated in round two. But that’s not always the case.</p>\n" +
    "\n" +
    "\t<h2>Detailed Rules</h2>\n" +
    "\n" +
    "\t<p>Cards are broken up into two decks.</p>\n" +
    "\n" +
    "\t<p>The first deck is the actor deck.</p>\n" +
    "\n" +
    "\t<p>The actor deck will inform the acting player what character you will be playing in their charade/scene. An actor card will fall into the following category types; a person, a persona, a profession, a thing, or an item.</p>\n" +
    "\n" +
    "\t<p>An actor card is not always logical. So be prepared to act like a subway sandwich if the role calls for it.</p>\n" +
    "\n" +
    "\t<p>The second deck is the scenario deck.</p>\n" +
    "\n" +
    "\t<p>The scenario deck is the action the acting player will be acting out and what the other players will be guessing.</p>\n" +
    "\n" +
    "\t<p>The combination of the actor and the scenario card is called the scene.</p>\n" +
    "\n" +
    "\t<p>Players will be acting out scenes while other players either try and guess the scene or mislead others to not guess the scene.</p>\n" +
    "\n" +
    "\t<p>Each scene will last 30 seconds.</p>\n" +
    "\n" +
    "\n" +
    "\t<h3>Starting The Game</h3>\n" +
    "\n" +
    "\t<p>To start the game each player draws 3 Actor and Scenario Cards.</p>\n" +
    "\n" +
    "\t<p>The first player to act out is the the player who has had the most sexual partners. Be honest. If no one has had any sexual partners then the player who is the fastest goes first.</p>\n" +
    "\n" +
    "\t<p>All other plays give the acting player a scene. Remember a scene is a combination of an actor and scenario card.</p>\n" +
    "\n" +
    "\t<p>The acting player reviews the scenes submitted and picks one scene to act out.</p>\n" +
    "\n" +
    "\t<p>The timer starts.</p>\n" +
    "\n" +
    "\t<h3>The God Player</h3>\n" +
    "\n" +
    "\t<p>Charades sucks. And nobody knows that better than god. Being omnipresent and all knowing makes having fun in a guessing game impossible. But what God loves doing is fucking with stupid players.</p>\n" +
    "\n" +
    "\t<p>If the acting player picks your scene you are the GOD PLAYER.</p>\n" +
    "\n" +
    "\t<p>The goal of the GOD PLAYER is to throw everyone else off the trail of the scene. This can be done by not saying anything, or trying to trip up the acting player into saying one of the words on the printed cards, or by just shouting out random answers.</p>\n" +
    "\n" +
    "\t<p>It is the goal of the GOD PLAYER to waste everyone’s time for their own twisted pleasure.</p>\n" +
    "\n" +
    "\t<h3>Scoring</h3>\n" +
    "\n" +
    "\t<p>If someone guesses the scene the acting player will give them the scenario card to represent a point. The acting player will keep the acting card for a performance that GOD couldn’t even keep down.</p>\n" +
    "\n" +
    "\t<p>If the GOD PLAYER wins they get both points. It pays to be divine. And an asshole.</p>\n" +
    "\n" +
    "\t<p>Any combination of the words on the card will count as a correct guess. The general “jist” of the words on the card will also work. The only rule on guessing is that the guess must be made formally by combining the Actor and Scenario.</p>\n" +
    "\n" +
    "\t<p>If the scene was: <i>God Gets A First Time Abortion</i></p>\n" +
    "\n" +
    "\t<p>A correct guess would be: <i>God Gets an abortion</i>, <i>God Gets a First Abortion</i>, <i>God Has First Abortion</i>.</p>\n" +
    "\n" +
    "\t<p>As an example a bad guess would be: Abortion god, god abortion, or by guessing God and then waiting five minutes and shouting “OH HE’S GETTING AN ABORTION.”</p>\n" +
    "\n" +
    "\t<p>Remember any jist guess counts. It is also possible for another, quicker, guessing player to steal an answer by forming it into the correct guess format. So be careful about shouting answers that don’t following the formal actor/scenario guessing format.</p>\n" +
    "\n" +
    "\t<h3>End Of Scene</h3>\n" +
    "\n" +
    "\t<p>After the end of each scene gloat and draw a new actor and scenario card.</p>\n" +
    "\n" +
    "\t<p>The person who guessed the answer will now becoming the acting player. If nobody guessed the answer the GOD PLAYER becomes the acting player.</p>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/submitView.html',
    "<div id=\"submitView\">\n" +
    "\t<h2>Create a new Character or Scenario card</h2>\n" +
    "\t<hr>\n" +
    "\t<p>If you're having trouble thinking of a good idea try <a ui-sref=\"vote\">voting</a>. <br>\n" +
    "\t<b>Click on a card below to edit.</b></p>\n" +
    "\t<div class=\"cards row\">\n" +
    "\t\t<submit data-type=\"0\" class=\"col-sm-4 col-sm-offset-2 col-md-3 col-md-offset-3\">\n" +
    "\t\t</submit>\n" +
    "\t\t<submit data-type=\"1\" class=\"col-sm-4 col-md-3\">\n" +
    "\t\t</submit>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/suggestionsView.html',
    "<h1>Suggestions List</h1>\n" +
    "<p>Click on headers to sort.</p>\n" +
    "<suggestions></suggestions>"
  );


  $templateCache.put('frontend/views/topView.html',
    "<div id=\"topView\">\n" +
    "\t<h2>Top Submissions</h2>\n" +
    "\t<hr>\n" +
    "\t<p>These are the best of the best so far! If you dont agree <a ui-sref=\"vote\">start voting</a>!</p>\n" +
    "\t\n" +
    "\t<top-submissions></top-submissions>\n" +
    "</div>"
  );


  $templateCache.put('frontend/views/voteView.html',
    "<div id=\"voteView\">\n" +
    "\t<h2>Pick your favorite pair</h2>\n" +
    "\t<hr>\n" +
    "\t<vote></vote>\n" +
    "</div>"
  );

}]);
