const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const sizes = [128, 256];

exports.handler = async (event) => {
    console.log('Upload event:', JSON.stringify(event, null, 2));

    const params = {
        FunctionName: process.env.WRITE_TO_OUTPUT_BUCKETS_FUNCTION,
        InvocationType: 'Event',
    };

    const s3Objects = event['Records'].map((record) => record['s3']);

    for (var i = 0; i < sizes.length; i++) {
        params['Payload'] = JSON.stringify({ "size": sizes[i], s3Objects })
        await lambda.invoke(params).promise();
    }
};