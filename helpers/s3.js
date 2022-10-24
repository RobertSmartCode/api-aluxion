const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const storage = new S3({
    accessKeyId,
    secretAccessKey
});

const getBuckets = () => {
    return storage.listBuckets().promise();
};

const uploadToBucket = (name,tempFilePath) => {
    const stream = fs.createReadStream(tempFilePath);
    const params = {
        Bucket:process.env.AWS_S3_BUCKET_NAME,
        Key:name,
        Body:stream
    };
    
    return storage.upload(params).promise();
};

module.exports = {
    getBuckets,
    uploadToBucket
};