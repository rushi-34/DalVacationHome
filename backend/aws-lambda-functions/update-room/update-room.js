import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const { id, roomType, maxGuests, price, amenities } = JSON.parse(event.body);

        const params = {
            TableName: 'dalv',
            Key: { id: id },
            UpdateExpression: 'set roomType = :rt, maxGuests = :mg, price = :p, amenities = :a',
            ExpressionAttributeValues: {
                ':rt': roomType,
                ':mg': maxGuests,
                ':p': price,
                ':a': amenities
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await ddbDocClient.send(new UpdateCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Room updated successfully',
                updatedRoom: result.Attributes
            })
        };
    } catch (error) {
        console.error('Error updating room:', error);
        return {
            statusCode: 500,
        
            body: JSON.stringify({ error: 'Failed to update room' })
        };
    }
};
