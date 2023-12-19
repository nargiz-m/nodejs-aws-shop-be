import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";

export const handler = async (event: APIGatewayTokenAuthorizerEvent) => {
    const token = event.authorizationToken; 
    let effect = 'Allow';
    try {
        const creds = Buffer.from(token.split(" ")[1], 'base64').toString();
        const [username, password] = creds.split(':');

        if(!Object.keys(process.env).includes(username) || process.env[username] !== password) {
            effect='Deny'   
        }
    } catch (error) {
        effect='Deny'
    } finally {
        return {
            "principalId": "user",
            "policyDocument": {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Action": "execute-api:Invoke",
                  "Effect": effect,
                  "Resource": event.methodArn
                }
              ]
            }
        }
    }
}