const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Request Event:", event);
    const userId = JSON.parse(event.body).user_id;
    console.log("User ID:", userId);
  
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "User ID is required" }),
      };
    }
  
    const params = {
      TableName: 'dalvac-bookings',
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };
  
    try {
      const result = await docClient.query(params).promise();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.Items),
      };
    } catch (error) {
      console.error("Error querying DynamoDB", error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    }
  };
