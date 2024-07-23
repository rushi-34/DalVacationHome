import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export const handler = async (event) => {
  const USER_POOL_ID = "us-east-1_oAtQBU6kM";

  try {
    const params = {
      UserPoolId: USER_POOL_ID,
      AttributesToGet: null, 
      Limit: 60, 
    };

    const command = new ListUsersCommand(params);
    const data = await client.send(command);

    const users = data.Users.map(user => {
      const attributes = {};
      user.Attributes.forEach(attr => {
        attributes[attr.Name] = attr.Value;
      });
      return {
        Username: user.Username,
        UserStatus: user.UserStatus,
        Enabled: user.Enabled,
        UserCreateDate: user.UserCreateDate,
        UserLastModifiedDate: user.UserLastModifiedDate,
        ...attributes
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch users" }),
    };
  }
};
