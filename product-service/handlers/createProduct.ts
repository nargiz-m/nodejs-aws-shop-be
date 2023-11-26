import { APIGatewayProxyEvent } from "aws-lambda";
import { postNewProduct } from "../services/postNewProduct";

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('POST /products, body:', JSON.stringify(event.body))
    if(!event.body) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: 'No request body'
        }
    }

    try {
        const product = await postNewProduct(JSON.parse(event.body)) 
        return {
            statusCode: 201,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(product)
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: 'Internal Server Error'
        }
    }
}