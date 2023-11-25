import { APIGatewayProxyEvent } from "aws-lambda";
import products from "../mocks";

export const handler = async (event: APIGatewayProxyEvent) => {
  const product = products.find(product => product.id === event.pathParameters?.product_id)
   
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
};