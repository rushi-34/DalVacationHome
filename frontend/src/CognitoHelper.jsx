import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

const poolData = {
    UserPoolId: 'us-east-1_oAtQBU6kM', 
    ClientId: 'kcjgj5ug89c4ugbj6vog6ddb5', 
  };

  const store = {};

  export const getUserPool = () => {
    return new CognitoUserPool(poolData);
  }
  export const getCognitoUser = (username) => {
      const userPool = getUserPool();
      return new CognitoUser({
          Username: username,
          Pool: userPool,
      });
  }
  
  export const getUserAttributes = (username) => {
      
  }
  
  export const getAwsCredentials = (username, password) => {
      const authenticationData = {
          Username: username,
          Password: password,
        };
  
        return new AuthenticationDetails(authenticationData);
  }
  
  export  const getCognitoidentityserviceprovider = () => {
    return new AWS.CognitoIdentityServiceProvider();
  }
  
  export const logout = () => {
      const userPool = getUserPool();
      const cognitoUser = userPool.getCurrentUser();
      cognitoUser.signOut();
  }