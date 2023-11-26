import { getProductsWithStocks } from "../services/getProductsWithStocks";

export const handler = async () => {
  console.log('GET /products')
  try {
    const products = await getProductsWithStocks();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(products)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: 'Internal Server Error'
    }
  }
};