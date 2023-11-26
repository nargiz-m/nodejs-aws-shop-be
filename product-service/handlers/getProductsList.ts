import { getProductsWithStocks } from "../services/getProductsWithStocks";

export const handler = async () => {
  const products = await getProductsWithStocks();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(products)
  };
};