const AWS = require("aws-sdk");

// console.log(
//   "S3===>",
//   process.env.BUCKET_NAME,
//   process.env.AWS_ACCESS_KEY,
//   process.env.AWS_SECRET_KEY
// );

exports.uploadToS3 = async (data, filename) => {
  // Need to fix this bug tried a lot researched but didnt came to conclusion so waiting for senior developers advice
  const bucketName = process.env.BUCKET_NAME;
  const iamAccessKey = process.env.AWS_ACCESS_KEY;
  const iamSecretKey = process.env.AWS_SECRET_KEY;

  // const bucketName = "expensetrackerbackend";
  // const iamAccessKey = "AKIA6PLPWQRGBURO7P6J";
  // const iamSecretKey = "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";

  const s3Bucket = new AWS.S3({
    accessKeyId: iamAccessKey,
    secretAccessKey: iamSecretKey,
  });

  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  // s3Bucket returns a promise so we have to use like this.
  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3response) => {
      if (err) {
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
};
