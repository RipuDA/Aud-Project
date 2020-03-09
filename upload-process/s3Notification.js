const AWS = require('aws-sdk')

exports.handler =   (event,callback, context) => {
    // TODO implement
    console.log(event);
    var params = {
        Bucket: "aud-groot-use2-upload-dev", 
        NotificationConfiguration: {
        QueueConfigurations: 
        [
            {
                Id: "s3-event-configuration",
                Events: [ "s3:ObjectCreated:*" ],
                QueueArn: "arn:aws:sqs:us-east-2:XXXXXXXXXXX:audible-groot-upload-AudGrootDownloadQueue-F2E2YA7APD9U",
                Filter: {
                    Key: {
                        FilterRules: [
                            {
                                Name: "suffix",
                                Value: ".done"
                            }
                        ]
                    }
                }
            }
        ]
       
    }
 };
 
 var codepipeline = new AWS.CodePipeline();
 
  // Retrieve the Job ID from the Lambda action
 var jobId = event["CodePipeline.job"].id;

 
 // Notify AWS CodePipeline of a successful job
    
    
 var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
 
 s3.putBucketNotificationConfiguration(params, function(err, data) {
    
   if (err) {
       console.log(err, err.stack);
       console.log("Error Block");
    putJobFailure(err); 
   } // an error occurred
   else     
   {
       console.log(data); 
       console.log("Success Block");
        putJobSuccess("Tests passed.");
       
   }           // successful response
 });
 
 
 var putJobSuccess =   function(message,callback) {
        var params = {
            jobId: jobId
        };
        codepipeline.putJobSuccessResult(params, function(err, data) {
           
            if(err) {
                console.log(err);      
            } else {
                console.log("In side CodepipelineSuccess Block");
                
            }
        });
    };
    
 // Notify AWS CodePipeline of a failed job
    var putJobFailure =  function(message,callback) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: "JobFailed",
                externalExecutionId: context.invokeid
            }
        };
        codepipeline.putJobFailureResult(params, function(err, data) {
            if(err) {
                console.log(err);       
            } else {
                console.log(message);      
            }
                
        });
    };
    
 
 
}
