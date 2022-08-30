import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData ={
  UserPoolId:"us-east-1_llUe3T5Ws",
  ClientId:"g3kfjmcr51tprhrqethrgqs9n"
}

export default new CognitoUserPool(poolData)