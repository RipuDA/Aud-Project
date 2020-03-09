var AWS = require('aws-sdk');;
exports.handler = (event, context, callback) => {

 console.log(event);
 if(event['SAMLResponse']) {
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = process.env.REGION; // Region
    console.log(event['SAMLResponse']);
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.IDENTITY_POOL_ID,
    Logins: {
        [`${process.env.LOGIN_URL}`]: event['SAMLResponse']
       // 'arn:aws:iam::404814018302:saml-provider/saml-provider-audible-groot-cognito': event['SAMLResponse']
    }
    });

   console.log(AWS.config);

    const s3Object = new AWS.S3({
    apiVersion: "2006-03-01",signatureVersion:"v4"
    });
    const filename = event['RelayState'] + process.env.FILE_EXTENSION;
    const bucketparams = { Bucket: process.env.BUCKET_NAME, Key: filename, Expires: parseInt(process.env.EXPIRY_TIME) };
    s3Object.getSignedUrl('getObject', bucketparams, function(err, url) {
    console.log(err);
    console.log(url);
    if(!err)
    {
        callback(null,{ location: url });
    }
    else
    {
        callback(new Error(err));
    }

    });
 }
  else
 {
    callback(null,'UnAuthorized Access');
     
 }

};
