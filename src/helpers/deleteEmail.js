
import { CognitoIdentityProviderClient, AdminDeleteUserCommand, } from "@aws-sdk/client-cognito-identity-provider"
import { CognitoUserPool } from "amazon-cognito-identity-js";

export const deleteEmail = async (email) => {
  try {

    let delUser = {
      UserPoolId: process.env.USER_POOL,
      Username: email
    };
    const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
    const delResult = await client.send(new AdminDeleteUserCommand(delUser));
    return delResult
  } catch (error) {
    console.log(error)
  }

}