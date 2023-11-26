import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const joinProductsAndStocks = (products: any[], stocks?: any[]) => {
    return products.map((product) => {
        const matchingStock = stocks?.find((stock) => stock.product_id === product.id)
        return {
            ...product,
            count: matchingStock ? matchingStock.count : 0
        }
    })
}

export const getProductsWithStocks = async () => {
    const dbClient = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(dbClient);
    const getProducts = new ScanCommand({TableName: "Products"});
    const getStocks = new ScanCommand({TableName: "Stocks"});
    const products = await docClient.send(getProducts);
    const stocks = await docClient.send(getStocks);

    return products.Items?.length ? joinProductsAndStocks(products.Items, stocks.Items) : [];
}