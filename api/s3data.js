var s3 = require('s3');
var _ = require('lodash');

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});
console.log(process.env.S3_ACCESS_KEY_ID, process.env.S3_ACCESS_SECRET);

module.exports.getFiles = _getFiles;

function _getFiles(req, res) {
	var objects = [];
	var params = {
		s3Params: {
			Bucket: 'ghg-upload'
		}
	}
	var lister = client.listObjects(params);

	lister.on('data', function(data) {
		if(data.Contents && data.Contents.length > 0) {
      _.each(data.Contents, function(content) {
        content.url = s3.getPublicUrlHttp(params.s3Params.Bucket, content.Key);
      })
			Array.prototype.push.apply(objects, data.Contents);
		}
	})

	lister.on('end', function() {
		res.status(200).send(objects);
	});
}