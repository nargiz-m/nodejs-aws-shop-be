import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = (event: APIGatewayProxyEvent) => {
    const token = event.headers.Authorization;
    if (!token) {
        return {
            statusCode: 401,
            body: 'Missing authorization header'
        }
    } 
    try {
        const creds = atob(token.split(" ")[1]);
        const [username, password] = creds.split(':');

        if(! Object.keys(process.env).includes(username) || process.env[username] !== password) {
            throw new Error();   
        }

        return {
            statusCode: 200,
            body: 'Success'
        };
    } catch (error) {
        return {
            statusCode: 403,
            body: 'Access Denied'
        }
    }
}