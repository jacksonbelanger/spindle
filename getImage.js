require('dotenv').config();
const aws = require('aws-sdk');
const randomstring = require("randomstring");

const aws_secret_key = process.env.AWS_SECRET_KEY;
const aws_access_key = process.env.AWS_ACCESS_KEY;



async function query(input) {

    const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
        headers: { Authorization: `Bearer ${process.env.HUGGING_FACE}` },
        method: "POST",
        body: JSON.stringify({"inputs": input})
    }
    );


    const result_buffer = await response.arrayBuffer()

    aws.config.update({
    secretAccessKey: aws_secret_key,
    accessKeyId: aws_access_key,
    signatureVersion: 'v4',
    region: 'us-east-1'

});

const s3 = new aws.S3({
    params: {
        Bucket: 'spindle-gt',
        signatureVersion: 'v4',
        region: 'us-east-1'
    }
});

//create random key


   
let params = {
            Bucket: 'spindle-gt',
            Key: randomstring.generate()+'.png',
            Body: Buffer.from(result_buffer)
        };
        let image_response = await s3.upload(params).promise();

        let image_destination = image_response.Location;


   

    return image_destination;

}


console.log(query("Create an image of an alpaca"))

