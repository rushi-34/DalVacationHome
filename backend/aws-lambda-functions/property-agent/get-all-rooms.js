import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const params = {
    TableName: "dalv",
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    const rooms = data.Items.map((room) => ({
      ...room,
      amenities: room.amenities?.values() ? [...room.amenities] : [],
      feedback: room.feedback?.values() ? [...room.feedback] : [],
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(rooms),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve rooms" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};