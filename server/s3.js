const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "rensimageboardbucket",
            ACL: "public-read", //basically saying people can view this file
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); // this makes it return a promise

    promise
        .then(() => {
            // it worked!!!
            console.log("amazon upload complete!");
            next();
            //OPTIONAL
            fs.unlink(path, () => {});
            //this is called a noop function/ no operation
        })
        .catch((err) => {
            // uh oh
            console.log("something went wrong in uploading to S3:", err);
            res.sendStatus(404);
        });
};
