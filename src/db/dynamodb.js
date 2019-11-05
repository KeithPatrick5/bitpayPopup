
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.put = async params => await docClient.put(params).promise();

module.exports.get = async params => await docClient.get(params).promise();

module.exports.update = async params => await docClient.update(params).promise();