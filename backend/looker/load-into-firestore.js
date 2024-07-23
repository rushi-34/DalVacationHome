const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { Firestore } = require('@google-cloud/firestore');
const language = require('@google-cloud/language');
const serviceAccount = require("./serviceAccount.json");
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const naturalClient = new language.LanguageServiceClient({
  credentials: serviceAccount
});

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const firestore = new Firestore({
  projectId: serviceAccount.project_id,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key
  }
});

exports.handler = async (event) => {
  
  console.log("Event:", event);
  
  const { username, firstName, lastName, description } = event; 
  
  const params = {
    TableName: 'dalvac-users',
    Key: {
      username: username,
    }
  }
  
  const text = description;

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  try {
    const command = new GetCommand(params);
    
    const response = await ddbDocClient.send(command);
    console.log("document: ", document)
    const [result] = await naturalClient.analyzeSentiment({document: document});
    
    const sentiment = result.documentSentiment;
    
    const data = response.Item;

console.log("firestore/////////")
    await firestore.collection('reviews').doc(username).set({
      // username: username,
      //   firstName,
      //   lastName,
      //   description,
        data,
        sentimentScore: sentiment
    })
    
    console.log("00000000000")
    return {
            statusCode: 200,
            body: {
                response: response.Item,
                // data: lookerData
                message: "Data stored in firestore",
                sentiment: sentiment
            }
        };
        console.log("sent.........")
    
  } catch (error) {
    return {
            statusCode: 400,
            body: JSON.stringify(error.message),
    }
  }
}