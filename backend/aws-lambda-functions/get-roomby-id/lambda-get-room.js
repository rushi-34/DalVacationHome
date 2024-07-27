import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { id } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Room ID is required" }),
    };
  }

  const params = {
    TableName: "dalv",
    Key: {
      id: id,
    },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    let room = data.Item;

    if (!room) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Room not found" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    room.amenities = room.amenities?.values ? [...room.amenities] : [];
    room.feedback = room.feedback?.values ? [...room.feedback] : [];

    return {
      statusCode: 200,
      body: JSON.stringify(room),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve room" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
