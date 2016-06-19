exports.stripPrivateData = _stripPrivateData;
exports.isUserAdmin = isUserAdmin;
exports.isUserBeta = _isUserBeta;
exports.isAdminRole = _isAdminRole;

// Removes private data from original object
function _stripPrivateData(request, parseUser) {
  var shouldStrip = isThisSomeoneElsesAccount(request.user, parseUser);
  if(shouldStrip) {
    delete parseUser.attributes.email;
    delete parseUser.attributes.username;
    delete parseUser.attributes.ACL;
    delete parseUser.attributes.admin;
    delete parseUser.attributes.beta;
    delete parseUser.attributes.emailVerified;
    delete parseUser.createdAt;
    delete parseUser.updatedAt;
    // console.log(parseUser);
  }
}

function isThisSomeoneElsesAccount(requestUser, parseUser) {
  if(requestUser && requestUser.id === parseUser.id)
    return false; //this is my account
  else
    return true; //yes, this is someone elses account
}

// method should not be exposed to raw requests
function isUserAdmin(userId) {
  // to allow fetching users
  //Parse.Cloud.useMasterKey();

  var query = new Parse.Query(Parse.User);
  var promise = query.get(userId)
    .then(function (user) {
      if(user && user.get('admin')) {
        return true;
      } else {
        return false;
      }
    })
  return promise;
}

function _isAdminRole(callback, request, response) {
  //Parse.Cloud.useMasterKey();
  var currentUser = request.user;
  if(currentUser) {
    var query = (new Parse.Query(Parse.Role));
    query.equalTo('name', 'Administrator');
    query.first().then(function(adminRole) {
      console.log(adminRole);
      if (adminRole) {
        var adminRelation = new Parse.Relation(adminRole, 'users');
        var adminsQuery = adminRelation.query();
        adminsQuery.equalTo('objectId', currentUser.id);
        adminsQuery.first()
        .then(function(user) {
          if(user) {
            callback(request, response);
          } else {
            response.error('You must be an administrator');
          }
        });
      } else {
        response.error('there is no Administrator role');
      }
    });
  } else {
    return response.error('You must be logged in to use this');
  }
}

// method should not be exposed to raw requests
function _isUserBeta(userId) {
  // to allow fetching users
  //Parse.Cloud.useMasterKey();

  var query = new Parse.Query(Parse.User);
  var promise = query.get(userId)
    .then(function (user) {
      if(user && user.get('beta')) {
        return true;
      } else {
        return false;
      }
    })
  return promise;
}