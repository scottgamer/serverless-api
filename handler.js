"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-80-10" });
const uuid = require("uuid/v4");

const postsTable = process.env.POSTS_TABLE;

function response(statusCode, message) {
  return {
    statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.createPost = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const post = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body
  };

  return db
    .put({
      TableName: postsTable,
      Item: post
    })
    .promise()
    .then(() => {
      callback(null, response(201, post));
    })
    .catch(error => {
      response(err.statusCode, error, message);
    });
};
