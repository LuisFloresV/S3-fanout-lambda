const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const { Jimp, JimpMime } = require("jimp");

exports.handler = async (event) => {
    const size = event.size;

    async function uploadToS3(name, size, suffix, buffer) {
        const keyName = name + '-' + size + '.' + suffix;

        console.log(size)
        const params = {
            Body: buffer,
            Bucket: size === 128 ? process.env.BUCKET_1 : process.env.BUCKET_2,
            Key: keyName
        }

        await S3.putObject(params).promise();
    }

    for (const s3Object of event.s3Objects) {

        const bucket = s3Object.bucket.name;
        const key = s3Object.object.key;
        const [name, suffix] = key.split('.');


        const s3Response = await S3.getObject({ Bucket: bucket, Key: key }).promise();

        const image = await Jimp.read(s3Response.Body);

        // Resize the image
        image.resize({ w: size });

        // Get the buffer in JPEG format
        const buffer = await image.getBuffer(JimpMime.jpeg);

        await uploadToS3(name, size, suffix, buffer);
    }
}