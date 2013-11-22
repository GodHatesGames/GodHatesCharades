exports.stripPrivateData = stripPrivateData;

// Removes private data from original object
function stripPrivateData(parseUser) {
	delete parseUser.attributes.email;
	delete parseUser.attributes.username;
	delete parseUser.attributes.ACL;
	delete parseUser.attributes.admin;
	delete parseUser.createdAt;
	delete parseUser.updatedAt;
	console.log(parseUser);
}