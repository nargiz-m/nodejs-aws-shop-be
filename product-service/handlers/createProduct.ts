import { APIGatewayProxyEvent } from "aws-lambda";
import { postNewProduct } from "../services/postNewProduct";
import { validateProductBody } from "../validation/productValidator";

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('POST /products, body:', JSON.stringify(event.body));

    const isProductInvalid = validateProductBody(event.body);
    if(isProductInvalid) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: 'Product data is invalid'
        }
    }

    try {
        const product = await postNewProduct(JSON.parse(event.body ?? '')) 
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