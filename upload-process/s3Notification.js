var params = {
  Bucket: "examplebucket", 
  NotificationConfiguration: {
   QueueConfigurations: [
      {
     Events: [
        "s3:ObjectCreated:*"
     ],
     Filter: {S3Key: {Rules: [{Name:"suffix",Value:".done"}]}},
     Queue: "arn:aws:sqs:us-east-1:404814018302:audible-groot-download-AudGrootDownloadQueue-9C3B21WJ38FN"
    }
   ]
  }
 };
 s3.putBucketNotificationConfiguration(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
 });