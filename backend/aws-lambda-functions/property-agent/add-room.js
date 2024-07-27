const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const room = JSON.parse(event.body);
    console.log("rooom data: ", room)

    
    const id = uuidv4();

    const newItem = {
      ...room,
      amenities: new Set(room.amenities), 
      id: id,
      overall_sentiment: null,
      overall_score: null,
      star_rating: null,
    };
    
    const params = {
      TableName: "dalv",
      Item: newItem,
    };

    const newAvailability = {
      roomId:room.roomNumber,
      availability: {},
    }
    const availability = {
      TableName: "RoomAvailability",
      Item: newAvailability,
    }


    await ddbDocClient.send(new PutCommand(params));
    //Add availability
  await ddbDocClient.send(new PutCommand(availability));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Could not add room" }),
    };
  }
};
