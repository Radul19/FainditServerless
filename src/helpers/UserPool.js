import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData ={
  UserPoolId:process.env.USER_POOL,
  ClientId:process.env.CLIENT_ID
}

export default new CognitoUserPool(poolData)