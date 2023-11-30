import { APIGatewayProxyEvent } from "aws-lambda";
import { postNewProduct } from "../services/postNewProduct";
import { productSchema } from "../validation/productValidator";

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('POST /products, body:', JSON.stringify(event.body));

    try {
        const productObj = JSON.parse(event.body ?? '')
        const {error} = productSchema.validate(productObj);
        if(error) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: error.message //validation error
            }
        }
        const productId = await postNewProduct(productObj) 
        return {
            statusCode: 201,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: `Product with id ${productId} was created`
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: 'Server error occurred'
        }
    }
}