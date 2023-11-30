import { APIGatewayProxyEvent } from "aws-lambda"
import { getSingleProduct } from "../services/getSingleProduct";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log('GET /products/:product_id, product_id:', event.pathParameters?.product_id)
  try {
    const product = await getSingleProduct(event.pathParameters?.product_id ?? '')
    
    if (product) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(product)
      };
    }

    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: 'Product not found'
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
};